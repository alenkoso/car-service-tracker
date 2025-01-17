// backend/src/routes/exports.js
import express from 'express';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { getDb } from '../db/init.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_PATH = path.join(__dirname, '..', 'fonts', 'OpenSans-Regular.ttf');

const router = express.Router();

// Helper function to format values
const formatValue = (value) => value || '/';
const formatCost = (cost) => cost ? `€${Number(cost).toFixed(2)}` : '/';
const formatMileage = (mileage) => mileage ? `${mileage.toLocaleString()} km` : '/';

router.get('/vehicle/:vehicleId/pdf', async (req, res) => {
    const vehicleId = req.params.vehicleId;
    console.log(`Starting PDF generation for vehicle ID: ${vehicleId}`);

    try {
        const db = await getDb();
        const vehicle = await db.get('SELECT * FROM vehicles WHERE id = ?', vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        const services = await db.all(`
            SELECT * FROM service_records 
            WHERE vehicle_id = ? 
            ORDER BY service_date DESC
        `, vehicleId);

        // Create PDF document with custom font
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Register and use custom font
        doc.registerFont('OpenSans', FONT_PATH);
        doc.font('OpenSans');

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 
            `attachment; filename="service_records_${vehicle.id}.pdf"`);

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

        doc.fontSize(12)
           .text(`Make: ${vehicle.make}`)
           .text(`Model: ${vehicle.model}`)
           .text(`Year: ${vehicle.year || '/'}`)
           .text(`Engine: ${formatValue(vehicle.engine)}`)
           .text(`VIN: ${formatValue(vehicle.vin)}`)
           .text(`First Registration: ${vehicle.first_registration ? 
                format(new Date(vehicle.first_registration), 'dd.MM.yyyy') : '/'}`)
           .moveDown();

        // Service records section
        if (services.length > 0) {
            doc.fontSize(16)
               .text('Service History')
               .moveDown(0.5);

            doc.fontSize(12);
            services.forEach((service, index) => {
                // Date and mileage header
                doc.text(`${format(new Date(service.service_date), 'dd.MM.yyyy')} - ${formatMileage(service.mileage)}`, 
                    { underline: true })
                   .moveDown(0.3);

                // Service details
                doc.text(`Type: ${formatValue(service.service_type)}`)
                   .text(`Description: ${formatValue(service.description)}`)
                   .text(`Location: ${formatValue(service.location)}`)
                   .text(`Cost: ${formatCost(service.cost)}`);

                // Next service information
                if (service.next_service_mileage || service.next_service_notes) {
                    doc.moveDown(0.3)
                       .text('Next Service:');
                    
                    if (service.next_service_mileage) {
                        doc.text(`Mileage: ${formatMileage(service.next_service_mileage)}`);
                    }
                    
                    if (service.next_service_notes) {
                        doc.text(`Notes: ${formatValue(service.next_service_notes)}`);
                    }
                }

                // Add space between records
                if (index < services.length - 1) {
                    doc.moveDown();
                }
            });
        } else {
            doc.text('No service records found.');
        }

        // Add footer with generation date
        doc.fontSize(8)
           .text(
               `Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, 
               50, 
               doc.page.height - 50,
               { align: 'center' }
           );

        // Finalize the document
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