import { useForm, Controller } from 'react-hook-form';
import ServiceTypeSelector from './ServiceTypeSelector';
import ServiceLocationSelector from './ServiceLocationSelector';

export default function ServiceForm({ 
    service, 
    onSubmit, 
    onCancel, 
    vehicles,
    selectedVehicleId 
}) {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: service || {
      vehicle_id: selectedVehicleId,
      service_date: new Date().toISOString().split('T')[0],
      mileage: '',
      service_type: '',
      description: '',
      cost: '',
      location: '',
      next_service_mileage: '',
      next_service_notes: ''
    }
  });

  const inputClassName = "block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const textareaClassName = "block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  const validationRules = {
    vehicle_id: {
      required: 'Vehicle selection is required'
    },
    service_date: { 
      required: 'Date is required' 
    },
    mileage: { 
      pattern: {
        value: /^$|^\d+$/,
        message: 'Please enter a valid number or leave empty'
      },
      validate: {
        positive: value => !value || Number(value) > 0 || 'Mileage must be positive',
        maxValue: value => !value || Number(value) <= 1000000 || 'Mileage cannot exceed 1,000,000'
      }
    },
    service_type: { 
      required: 'At least one service type is required',
      validate: {
        notEmpty: value => value.trim() !== '' || 'At least one service type is required'
      }
    },
    cost: {
      pattern: {
        value: /^$|^\d+(\.\d{0,2})?$/,
        message: 'Please enter a valid amount (e.g., 123.45) or leave empty'
      },
      validate: value => !value || Number(value) >= 0 || 'Cost cannot be negative'
    },
    next_service_mileage: {
      pattern: {
        value: /^$|^\d+$/,
        message: 'Please enter a valid number or leave empty'
      },
      validate: {
        positive: value => !value || Number(value) > 0 || 'Next service mileage must be positive',
        maxValue: value => !value || Number(value) <= 1000000 || 'Mileage cannot exceed 1,000,000'
      }
    }
  };

  const onSubmitForm = async (data) => {
    const formattedData = {
      ...data,
      mileage: data.mileage || null,
      cost: data.cost || null,
      next_service_mileage: data.next_service_mileage || null
    };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {/* Vehicle Selection */}
        <div className="sm:col-span-2">
          <label htmlFor="vehicle_id" className="block text-sm font-medium leading-6 text-gray-900">
            Vehicle*
          </label>
          <div className="mt-2">
            <select
              {...register('vehicle_id', validationRules.vehicle_id)}
              className={inputClassName}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </select>
            {errors.vehicle_id && (
              <p className="mt-2 text-sm text-red-600">{errors.vehicle_id.message}</p>
            )}
          </div>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="service_date" className="block text-sm font-medium leading-6 text-gray-900">
            Service Date*
          </label>
          <div className="mt-2">
            <input
              type="date"
              {...register('service_date', validationRules.service_date)}
              className={inputClassName}
            />
            {errors.service_date && (
              <p className="mt-2 text-sm text-red-600">{errors.service_date.message}</p>
            )}
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium leading-6 text-gray-900">
            Mileage (km)
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('mileage', validationRules.mileage)}
              placeholder="/"
              className={inputClassName}
            />
            {errors.mileage && (
              <p className="mt-2 text-sm text-red-600">{errors.mileage.message}</p>
            )}
          </div>
        </div>

        {/* Type Of Service */}
        <div className="sm:col-span-2">
          <label htmlFor="service_type" className="block text-sm font-medium leading-6 text-gray-900">
            Type Of Service*
          </label>
          <div className="mt-2">
            <Controller
              name="service_type"
              control={control}
              rules={validationRules.service_type}
              render={({ field }) => (
                <ServiceTypeSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.service_type?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
            Description
          </label>
          <div className="mt-2">
            <textarea
              {...register('description')}
              rows={4}
              className={textareaClassName}
            />
          </div>
        </div>

        {/* Cost */}
        <div>
          <label htmlFor="cost" className="block text-sm font-medium leading-6 text-gray-900">
            Cost (€)
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('cost', validationRules.cost)}
              placeholder="/"
              className={inputClassName}
            />
            {errors.cost && (
              <p className="mt-2 text-sm text-red-600">{errors.cost.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
            Location
          </label>
          <div className="mt-2">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <ServiceLocationSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.location?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Next Service Mileage */}
        <div>
          <label htmlFor="next_service_mileage" className="block text-sm font-medium leading-6 text-gray-900">
            Next Service (km)
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('next_service_mileage', validationRules.next_service_mileage)}
              placeholder="/"
              className={inputClassName}
            />
            {errors.next_service_mileage && (
              <p className="mt-2 text-sm text-red-600">{errors.next_service_mileage.message}</p>
            )}
          </div>
        </div>

        {/* Next Service Notes */}
        <div className="sm:col-span-2">
          <label htmlFor="next_service_notes" className="block text-sm font-medium leading-6 text-gray-900">
            Next Service Notes
          </label>
          <div className="mt-2">
            <textarea
              {...register('next_service_notes')}
              rows={2}
              className={textareaClassName}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}