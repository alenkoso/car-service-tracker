import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { SERVICE_TYPES } from '../utils/service-type-constants';

export default function ServiceTypeSelector({ value, onChange, error }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [query, setQuery] = useState('');
  const [customType, setCustomType] = useState('');

  useEffect(() => {
    if (value) {
      // Convert string of types to array and normalize
      const typeArray = value.split(',').map(t => t.trim());
      setSelectedTypes(typeArray);
    }
  }, [value]);

  const filteredTypes = query === ''
    ? SERVICE_TYPES
    : SERVICE_TYPES.filter((type) => {
        return type.name.toLowerCase().includes(query.toLowerCase()) ||
               type.description.toLowerCase().includes(query.toLowerCase());
      });

  const handleSelect = (type) => {
    let newTypes;
    if (typeof type === 'string') {
      // Handle custom type
      newTypes = [...selectedTypes, type];
      setCustomType('');
    } else {
      // Handle predefined type
      newTypes = [...selectedTypes, type.name];
    }
    setSelectedTypes(newTypes);
    onChange(newTypes.join(', '));
  };

  const handleRemove = (typeToRemove) => {
    const newTypes = selectedTypes.filter(type => type !== typeToRemove);
    setSelectedTypes(newTypes);
    onChange(newTypes.join(', '));
  };

  const handleCustomTypeSubmit = (e) => {
    if (e.key === 'Enter' && customType.trim()) {
      handleSelect(customType.trim());
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      {/* Selected Types Tags */}
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

      <Combobox onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:border-indigo-500">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search or add custom service type..."
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
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
            {query && !filteredTypes.some(type => type.name.toLowerCase() === query.toLowerCase()) && (
              <Combobox.Option
                value={query}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                Add custom type: "{query}"
              </Combobox.Option>
            )}
          </Combobox.Options>
        </div>
      </Combobox>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}