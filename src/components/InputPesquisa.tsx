import React, { useState, ChangeEvent } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface InputPesquisaProps {
  setPesquisa: React.Dispatch<React.SetStateAction<string>>;
}

const InputPesquisa: React.FC<InputPesquisaProps> = ({ setPesquisa }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setPesquisa(event.target.value);
  };

  const clearSearch = () => {
    setInputValue('');
    setPesquisa('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto sm:max-w-lg">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Pesquisar gibis..."
          className="w-full py-2 sm:py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 transition-all text-sm sm:text-base"
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            type="button"
            aria-label="Limpar pesquisa"
          >
            <FaTimes className="text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputPesquisa;