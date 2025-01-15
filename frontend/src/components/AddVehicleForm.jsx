import { useForm } from 'react-hook-form';

export default function AddVehicleForm({ vehicle, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: vehicle || {
      name: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      vin: '',
      engine: '',
      engine_type: '',
      first_registration: '',
      notes: ''
    }
  });

  const inputClassName = "block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  const validationRules = {
    name: { 
      required: 'Name is required' 
    },
    make: { 
      required: 'Make is required' 
    },
    model: { 
      required: 'Model is required' 
    },
    year: {
      min: {
        value: 1900,
        message: 'Year must be 1900 or later'
      },
      max: {
        value: new Date().getFullYear() + 1,
        message: 'Year cannot be in the future'
      }
    },
    vin: {
      maxLength: {
        value: 17,
        message: 'VIN cannot exceed 17 characters'
      }
    }
  };

  const onSubmitForm = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            Name*
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('name', validationRules.name)}
              className={inputClassName}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Make */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium leading-6 text-gray-900">
            Make*
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('make', validationRules.make)}
              className={inputClassName}
            />
            {errors.make && (
              <p className="mt-2 text-sm text-red-600">{errors.make.message}</p>
            )}
          </div>
        </div>

        {/* Model */}
        <div className="sm:col-span-2">
          <label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900">
            Model*
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('model', validationRules.model)}
              className={inputClassName}
            />
            {errors.model && (
              <p className="mt-2 text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>
        </div>

        {/* Engine Info */}
        <div>
          <label htmlFor="engine" className="block text-sm font-medium leading-6 text-gray-900">
            Engine
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('engine')}
              className={inputClassName}
              placeholder="2.0 TDI"
            />
          </div>
        </div>

        <div>
          <label htmlFor="engine_type" className="block text-sm font-medium leading-6 text-gray-900">
            Engine Type
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('engine_type')}
              className={inputClassName}
              placeholder="DCYA"
            />
          </div>
        </div>

        {/* Year and Registration */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium leading-6 text-gray-900">
            Year
          </label>
          <div className="mt-2">
            <input
              type="number"
              {...register('year', validationRules.year)}
              className={inputClassName}
            />
            {errors.year && (
              <p className="mt-2 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="first_registration" className="block text-sm font-medium leading-6 text-gray-900">
            First Registration
          </label>
          <div className="mt-2">
            <input
              type="date"
              {...register('first_registration')}
              className={inputClassName}
            />
          </div>
        </div>

        {/* VIN */}
        <div className="sm:col-span-2">
          <label htmlFor="vin" className="block text-sm font-medium leading-6 text-gray-900">
            VIN
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register('vin', validationRules.vin)}
              className={inputClassName}
              placeholder="WAUZZZ8V5KA123456"
            />
            {errors.vin && (
              <p className="mt-2 text-sm text-red-600">{errors.vin.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
            Notes
          </label>
          <div className="mt-2">
            <textarea
              {...register('notes')}
              rows={3}
              className={inputClassName}
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