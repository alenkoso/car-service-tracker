import express from 'express';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { getDb } from '../db/init.js';

const router = express.Router();

// Helper function to sanitize filename
const sanitizeFilename = (str) => {
    return str
        .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric chars with underscore
        .toLowerCase()
        .replace(/_+/g, '_') // Replace multiple underscores with single one
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

router.get('/vehicle/:vehicleId/pdf', async (req, res) => {
    const vehicleId = req.params.vehicleId;
    console.log(`Starting PDF generation for vehicle ID: ${vehicleId}`);

    try {
        const db = await getDb();
        
        // Get vehicle information
        const vehicle = await db.get('SELECT * FROM vehicles WHERE id = ?', vehicleId);
        console.log('Vehicle data:', vehicle);

        if (!vehicle) {
            console.log(`No vehicle found with ID: ${vehicleId}`);
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        // Get service records
        const services = await db.all(`
            SELECT * FROM service_records 
            WHERE vehicle_id = ? 
            ORDER BY service_date DESC
        `, vehicleId);
        console.log(`Found ${services.length} service records`);

        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Generate safe filename
        const safeFilename = sanitizeFilename(`service_records_${vehicle.make}_${vehicle.model}`);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${safeFilename}.pdf`);

        // Pipe PDF to response
        doc.pipe(res);

        // Document title
        doc.fontSize(20)
           .text('Vehicle Service Records', {
               align: 'center'
           })
           .moveDown();

        // Vehicle information section
        doc.fontSize(16)
           .text('Vehicle Information')
           .moveDown(0.5);

        doc.fontSize(12);
        [
            `Make: ${vehicle.make}`,
            `Model: ${vehicle.model}`,
            `Year: ${vehicle.year || 'N/A'}`,
            `Engine: ${vehicle.engine || 'N/A'}`,
            `VIN: ${vehicle.vin || 'N/A'}`,
            `First Registration: ${vehicle.first_registration ? 
                format(new Date(vehicle.first_registration), 'dd.MM.yyyy') : 'N/A'}`
        ].forEach(line => {
            doc.text(line).moveDown(0.2);
        });

        doc.moveDown();

        // Service records section
        if (services.length > 0) {
            doc.fontSize(16)
               .text('Service History')
               .moveDown(0.5);

            doc.fontSize(12);
            services.forEach((service, index) => {
                try {
                    // Date and mileage header
                    const header = `${format(new Date(service.service_date), 'dd.MM.yyyy')} - ${
                        service.mileage ? `${service.mileage.toLocaleString()} km` : 'N/A'
                    }`;
                    doc.text(header, { underline: true }).moveDown(0.3);

                    // Service details
                    const details = [
                        `Type: ${service.service_type || 'N/A'}`,
                        `Description: ${service.description || 'N/A'}`,
                        `Location: ${service.location || 'N/A'}`,
                        `Cost: ${service.cost ? `€${Number(service.cost).toFixed(2)}` : 'N/A'}`
                    ];

                    details.forEach(detail => {
                        doc.text(detail);
                    });

                    // Next service information
                    if (service.next_service_mileage || service.next_service_notes) {
                        doc.moveDown(0.3).text('Next Service:');
                        if (service.next_service_mileage) {
                            doc.text(`Mileage: ${service.next_service_mileage.toLocaleString()} km`);
                        }
                        if (service.next_service_notes) {
                            doc.text(`Notes: ${service.next_service_notes}`);
                        }
                    }

                    // Add space between records
                    if (index < services.length - 1) {
                        doc.moveDown();
                    }
                } catch (err) {
                    console.error(`Error processing service record ${service.id}:`, err);
                }
            });
        } else {
            doc.text('No service records found.');
        }

        // Finalize PDF
        doc.end();
        console.log('PDF generation completed successfully');

    } catch (error) {
        console.error('Error in PDF generation:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Failed to generate PDF', 
                details: error.message 
            });
        }
    }
});

export default router;