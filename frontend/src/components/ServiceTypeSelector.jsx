import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { SERVICE_TYPES } from '../utils/service-type-constants';

export default function ServiceTypeSelector({ value, onChange, error }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (value) {
      const typeArray = value.split(',').map(t => t.trim()).filter(Boolean);
      setSelectedTypes(typeArray);
    }
  }, [value]);

  const filteredTypes = query === ''
    ? SERVICE_TYPES
    : SERVICE_TYPES.filter((type) => {
        const searchStr = query.toLowerCase();
        return type.name.toLowerCase().includes(searchStr) ||
               type.description.toLowerCase().includes(searchStr);
      });

  const handleSelect = (type) => {
    let newTypes;
    if (typeof type === 'string') {
      // Handle custom type input
      if (!selectedTypes.includes(type)) {
        newTypes = [...selectedTypes, type];
      } else {
        return; // Don't add duplicates
      }
    } else {
      // Handle predefined type selection
      if (!selectedTypes.includes(type.name)) {
        newTypes = [...selectedTypes, type.name];
      } else {
        return; // Don't add duplicates
      }
    }
    setSelectedTypes(newTypes);
    onChange(newTypes.join(', '));
    setQuery(''); // Clear search after selection
  };

  const handleRemove = (typeToRemove) => {
    const newTypes = selectedTypes.filter(type => type !== typeToRemove);
    setSelectedTypes(newTypes);
    onChange(newTypes.join(', '));
  };

  return (
    <div className="relative">
      {/* Selected Types Display */}
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedTypes.map((type) => (
          <span
            key={type}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-600"
          >
            {type}
            <button
              type="button"
              onClick={() => handleRemove(type)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>

      {/* Service Type Selector */}
      <Combobox onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:border-indigo-500">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={() => query}
              placeholder="Search service types..."
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {filteredTypes.length === 0 && query !== '' && (
              <Combobox.Option
                value={query}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                Add custom service: "{query}"
              </Combobox.Option>
            )}
            
            {filteredTypes.map((type) => (
              <Combobox.Option
                key={type.id}
                value={type}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {type.name}
                    </span>
                    <span className={`block truncate text-sm ${
                      active ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {type.description}
                    </span>
                    {selectedTypes.includes(type.name) && (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}