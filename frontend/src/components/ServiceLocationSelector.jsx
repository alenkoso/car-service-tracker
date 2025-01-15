import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { SERVICE_LOCATIONS } from '../utils/service-locations-constants';

export default function LocationSelector({ value, onChange, error }) {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (value) {
      // Find existing location or create custom one
      const existingLocation = SERVICE_LOCATIONS.find(loc => loc.name === value);
      setSelected(existingLocation || { id: 'custom', name: value });
    }
  }, [value]);

  const filteredLocations = query === ''
    ? SERVICE_LOCATIONS
    : SERVICE_LOCATIONS.filter((location) => {
        return location.name.toLowerCase().includes(query.toLowerCase()) ||
               location.address.toLowerCase().includes(query.toLowerCase());
      });

  const handleSelect = (location) => {
    setSelected(location);
    onChange(location.name);
  };

  return (
    <div>
      <Combobox value={selected} onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:border-indigo-500">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(location) => location?.name}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Select or type a location..."
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {filteredLocations.map((location) => (
              <Combobox.Option
                key={location.id}
                value={location}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {location.name}
                      {location.address && (
                        <span className={`ml-2 text-sm ${active ? 'text-indigo-100' : 'text-gray-500'}`}>
                          ({location.address})
                        </span>
                      )}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
            {query && !filteredLocations.some(location => 
              location.name.toLowerCase() === query.toLowerCase()
            ) && (
              <Combobox.Option
                value={{ id: 'custom', name: query }}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                Add new location: "{query}"
              </Combobox.Option>
            )}
          </Combobox.Options>
        </div>
      </Combobox>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}