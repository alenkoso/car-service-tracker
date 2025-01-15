import { useState, useEffect } from 'react'
import axios from 'axios'
import { PlusIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/vehicles')
        setVehicles(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch vehicles')
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Vehicles</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your vehicles and their basic information.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Add vehicle
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-24 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="w-24 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Make
                    </th>
                    <th scope="col" className="w-48 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Model
                    </th>
                    <th scope="col" className="w-24 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Engine
                    </th>
                    <th scope="col" className="w-24 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Engine Type
                    </th>
                    <th scope="col" className="w-20 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Year
                    </th>
                    <th scope="col" className="w-32 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      First Registration
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Notes
                    </th>
                    <th scope="col" className="w-20 relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {vehicle.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{vehicle.make}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{vehicle.model}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{vehicle.engine || '-'}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{vehicle.engine_type || '-'}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{vehicle.year}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {vehicle.first_registration ? format(new Date(vehicle.first_registration), 'dd.MM.yyyy') : '-'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="max-w-2xl whitespace-normal break-words">
                          {vehicle.notes || '-'}
                        </div>
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
    </div>
  )
}