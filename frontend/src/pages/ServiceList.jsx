import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

export default function ServiceList() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState(1) // Default to first vehicle

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/services/vehicle/${selectedVehicleId}`)
        setServices(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch services')
        setLoading(false)
      }
    }

    fetchServices()
  }, [selectedVehicleId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Service Records</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all service records for your vehicle.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Add service record
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mileage</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Summary</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Next Service</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Next Service Notes</th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {format(new Date(service.service_date), 'dd.MM.yyyy')}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {service.mileage.toLocaleString()} km
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <div className="max-w-xs">{service.summary}</div>
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <div className="max-w-md">{service.description}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                €{service.cost.toFixed(2)}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">{service.location}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {service.next_service_mileage?.toLocaleString()} km
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <div className="max-w-xs">{service.next_service_notes || '-'}</div>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">
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
  )
}