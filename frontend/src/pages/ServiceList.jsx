import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { formatNumber, formatCost, formatMileage } from '../utils/formatters';
import ServiceFormModal from '../components/ServiceFormModal';
import DownloadPDFButton from '../components/DownloadPDFButton';

export default function ServiceList() {
    const [services, setServices] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedVehicleId, setSelectedVehicleId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingService, setEditingService] = useState(null)

    // Fetch vehicles and set initial vehicle
    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/vehicles')
            const sortedVehicles = response.data.sort((a, b) => a.name.localeCompare(b.name))
            setVehicles(sortedVehicles)
            
            // Set first vehicle as default if exists
            if (sortedVehicles.length > 0) {
                setSelectedVehicleId(sortedVehicles[0].id)
            }
        } catch (err) {
            setError('Failed to fetch vehicles')
        }
    }

    const fetchServices = async () => {
        if (!selectedVehicleId) return;

        try {
            const response = await axios.get(`http://localhost:3000/api/services/vehicle/${selectedVehicleId}`)
            setServices(response.data)
            setLoading(false)
        } catch (err) {
            setError('Failed to fetch services')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, [])

    useEffect(() => {
        if (selectedVehicleId) {
            fetchServices();
        }
    }, [selectedVehicleId])

    const handleAddClick = () => {
        setEditingService(null)
        setIsModalOpen(true)
    }

    const handleEditClick = (service) => {
        setEditingService(service)
        setIsModalOpen(true)
    }

    const handleSubmit = async (data) => {
        try {
            if (editingService) {
                await axios.put(`http://localhost:3000/api/services/${editingService.id}`, {
                    ...data,
                    vehicle_id: selectedVehicleId
                })
            } else {
                await axios.post('http://localhost:3000/api/services', {
                    ...data,
                    vehicle_id: selectedVehicleId
                })
            }
            fetchServices()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Failed to save service:', error)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Service Records</h1>

                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-4 sm:mt-0">
                    {/* Vehicle Selector */}
                    <div>
                        <label htmlFor="vehicle-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Vehicle
                        </label>
                        <select
                            id="vehicle-select"
                            value={selectedVehicleId || ''}
                            onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                            {vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {selectedVehicleId && (
                            <button
                                onClick={() => {
                                    // Handle PDF download
                                    window.open(`http://localhost:3000/api/exports/vehicle/${selectedVehicleId}/pdf`, '_blank');
                                }}
                                type="button"
                                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <svg className="-ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                                </svg>
                                Download PDF
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleAddClick}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add service record
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mileage</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type of Service</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Next Service</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Next Service Notes</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {services.map((service) => (
                                        <tr key={service.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {format(new Date(service.service_date), 'dd.MM.yyyy')}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatMileage(service.mileage)}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                <div className="max-w-xs whitespace-normal">{service.service_type}</div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                <div className="max-w-md whitespace-normal">{service.description}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatCost(service.cost)}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-normal">
                                                {service.location}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatMileage(service.next_service_mileage)}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-normal">
                                                {service.next_service_notes || '/'}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button 
                                                    onClick={() => handleEditClick(service)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ServiceFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={editingService}
                onSubmit={handleSubmit}
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
            />
        </div>
    )
}