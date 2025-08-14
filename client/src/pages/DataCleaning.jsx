import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const DataCleaning = () => {
  // Fallback icon component to prevent import errors
  const FallbackIcon = ({ className }) => (
    <div className={`${className} bg-gray-400 rounded`}></div>
  );

  const { isDarkMode } = useTheme();
  const { files } = useSelector(state => state.files);
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [cleanedData, setCleanedData] = useState([]);
  const [columnMappings, setColumnMappings] = useState({});
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ column: '', direction: 'asc' });
  const [missingValueStrategy, setMissingValueStrategy] = useState('remove');
  const [dataTypes, setDataTypes] = useState({});
  const [previewMode, setPreviewMode] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (selectedFile && files && files.length > 0) {
      const file = files.find(f => f.fileName === selectedFile);
      if (file && file.data) {
        setOriginalData(file.data);
        setCleanedData([...file.data]);
        initializeColumnMappings(file.data);
        generateStats(file.data);
      }
    }
  }, [selectedFile, files]);

  const initializeColumnMappings = (data) => {
    if (!data || data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const mappings = {};
    columns.forEach(col => {
      mappings[col] = col; // Default mapping
    });
    setColumnMappings(mappings);
  };

  const generateStats = (data) => {
    if (!data || data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const stats = {};
    
    columns.forEach(col => {
      const values = data.map(row => row[col]);
      const uniqueValues = [...new Set(values)];
      const missingValues = values.filter(val => val === '' || val === null || val === undefined).length;
      
      stats[col] = {
        total: values.length,
        unique: uniqueValues.length,
        missing: missingValues,
        missingPercentage: ((missingValues / values.length) * 100).toFixed(1),
        sampleValues: uniqueValues.slice(0, 5)
      };
    });
    
    setStats(stats);
  };

  const handleColumnRename = (oldName, newName) => {
    if (!newName.trim()) return;
    
    const newMappings = { ...columnMappings };
    newMappings[oldName] = newName;
    setColumnMappings(newMappings);
    
    // Update cleaned data with new column names
    const updatedData = cleanedData.map(row => {
      const newRow = {};
      Object.keys(row).forEach(key => {
        if (key === oldName) {
          newRow[newName] = row[key];
        } else {
          newRow[key] = row[key];
        }
      });
      return newRow;
    });
    
    setCleanedData(updatedData);
  };

  const handleFilter = (column, value, operator) => {
    const newFilters = { ...filters };
    newFilters[column] = { value, operator };
    setFilters(newFilters);
    
    applyFiltersAndSorting();
  };

  const handleSort = (column) => {
    const direction = sortConfig.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, direction });
    
    applyFiltersAndSorting();
  };

  const applyFiltersAndSorting = () => {
    let filteredData = [...originalData];
    
    // Apply filters
    Object.entries(filters).forEach(([column, filter]) => {
      if (filter.value !== '') {
        filteredData = filteredData.filter(row => {
          const cellValue = row[column];
          const filterValue = filter.value;
          
          switch (filter.operator) {
            case 'equals':
              return String(cellValue).toLowerCase() === String(filterValue).toLowerCase();
            case 'contains':
              return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
            case 'greater':
              return parseFloat(cellValue) > parseFloat(filterValue);
            case 'less':
              return parseFloat(cellValue) < parseFloat(filterValue);
            default:
              return true;
          }
        });
      }
    });
    
    // Apply sorting
    if (sortConfig.column) {
      filteredData.sort((a, b) => {
        const aVal = a[sortConfig.column];
        const bVal = b[sortConfig.column];
        
        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    
    setCleanedData(filteredData);
  };

  const handleMissingValues = () => {
    let updatedData = [...cleanedData];
    
    Object.keys(stats).forEach(column => {
      if (stats[column].missing > 0) {
        updatedData = updatedData.map(row => {
          if (row[column] === '' || row[column] === null || row[column] === undefined) {
            switch (missingValueStrategy) {
              case 'remove':
                return null; // Will be filtered out
              case 'zero':
                return 0;
              case 'mean':
                const numericValues = updatedData
                  .map(r => parseFloat(r[column]))
                  .filter(v => !isNaN(v) && v !== '' && v !== null && v !== undefined);
                return numericValues.length > 0 
                  ? (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2)
                  : '';
              case 'mode':
                const values = updatedData
                  .map(r => r[column])
                  .filter(v => v !== '' && v !== null && v !== undefined);
                const frequency = {};
                values.forEach(v => frequency[v] = (frequency[v] || 0) + 1);
                const mode = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
                return mode;
              default:
                return row[column];
            }
          }
          return row[column];
        });
      }
    });
    
    // Remove rows with null values if strategy is 'remove'
    if (missingValueStrategy === 'remove') {
      updatedData = updatedData.filter(row => row !== null);
    }
    
    setCleanedData(updatedData);
  };

  const handleDataTypeConversion = (column, newType) => {
    const updatedData = cleanedData.map(row => {
      const newRow = { ...row };
      
      switch (newType) {
        case 'number':
          newRow[column] = parseFloat(row[column]) || 0;
          break;
        case 'string':
          newRow[column] = String(row[column]);
          break;
        case 'boolean':
          newRow[column] = Boolean(row[column]);
          break;
        case 'date':
          newRow[column] = new Date(row[column]).toISOString().split('T')[0];
          break;
        default:
          break;
      }
      
      return newRow;
    });
    
    setCleanedData(updatedData);
    
    const newDataTypes = { ...dataTypes };
    newDataTypes[column] = newType;
    setDataTypes(newDataTypes);
  };

  const resetData = () => {
    setCleanedData([...originalData]);
    setFilters({});
    setSortConfig({ column: '', direction: 'asc' });
    setColumnMappings({});
    initializeColumnMappings(originalData);
  };

  const exportCleanedData = () => {
    if (cleanedData.length === 0) return;
    
    const csvContent = [
      Object.keys(cleanedData[0]).join(','),
      ...cleanedData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${selectedFile}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            ✨ Data Cleaning & Transformation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Clean, filter, and transform your data for better analysis
          </p>
        </div>

        {/* File Selection */}
        <div className={`p-6 rounded-xl mb-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Select Data Source</h2>
          <select
            value={selectedFile || ''}
            onChange={(e) => setSelectedFile(e.target.value)}
            className={`w-full p-3 border rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Choose a file to clean</option>
            {files && files.map(file => (
              <option key={file.fileName} value={file.fileName}>
                {file.fileName}
              </option>
            ))}
          </select>
        </div>

        {selectedFile && (
          <>
            {/* Data Overview */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">📊 Data Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Rows</p>
                  <p className="text-2xl font-bold text-blue-600">{cleanedData.length}</p>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Columns</p>
                  <p className="text-2xl font-bold text-green-600">{Object.keys(stats).length}</p>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Missing Values</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Object.values(stats).reduce((sum, stat) => sum + stat.missing, 0)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unique Values</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Object.values(stats).reduce((sum, stat) => sum + stat.unique, 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Column Management */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">🏷️ Column Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(stats).map(column => (
                  <div key={column} className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-600">{column}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setPreviewMode(!previewMode)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {previewMode ? 
                            (ChartBarIcon ? <ChartBarIcon className="h-4 w-4" /> : <FallbackIcon className="h-4 w-4" />) : 
                            (ChartBarIcon ? <ChartBarIcon className="h-4 w-4" /> : <FallbackIcon className="h-4 w-4" />)
                          }
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Missing:</span>
                        <span className={`font-mono ${
                          stats[column].missing > 0 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {stats[column].missing} ({stats[column].missingPercentage}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unique:</span>
                        <span className="font-mono">{stats[column].unique}</span>
                      </div>
                      
                      {/* Column Rename */}
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="New column name"
                          value={columnMappings[column] || column}
                          onChange={(e) => handleColumnRename(column, e.target.value)}
                          className={`w-full p-2 text-sm border rounded ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      
                      {/* Data Type Conversion */}
                      <div className="mt-2">
                        <select
                          value={dataTypes[column] || 'auto'}
                          onChange={(e) => handleDataTypeConversion(column, e.target.value)}
                          className={`w-full p-2 text-sm border rounded ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="auto">Auto Detect</option>
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtering & Sorting */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">🔍 Filtering & Sorting</h2>
              
              {/* Filters */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.keys(stats).slice(0, 3).map(column => (
                    <div key={column} className="space-y-2">
                      <label className="block text-sm font-medium">{column}</label>
                      <div className="flex space-x-2">
                        <select
                          value={filters[column]?.operator || 'equals'}
                          onChange={(e) => handleFilter(column, filters[column]?.value || '', e.target.value)}
                          className={`p-2 text-sm border rounded ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="equals">Equals</option>
                          <option value="contains">Contains</option>
                          <option value="greater">Greater Than</option>
                          <option value="less">Less Than</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Value"
                          value={filters[column]?.value || ''}
                          onChange={(e) => handleFilter(column, e.target.value, filters[column]?.operator || 'equals')}
                          className={`flex-1 p-2 text-sm border rounded ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="text-lg font-medium mb-3">Sorting</h3>
                <div className="flex space-x-4">
                  {Object.keys(stats).slice(0, 5).map(column => (
                    <button
                      key={column}
                      onClick={() => handleSort(column)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        sortConfig.column === column
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column}</span>
                        {ChartBarIcon ? <ChartBarIcon className="h-4 w-4" /> : <FallbackIcon className="h-4 w-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Values Handling */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">⚠️ Missing Values Handling</h2>
              <div className="flex items-center space-x-4 mb-4">
                <select
                  value={missingValueStrategy}
                  onChange={(e) => setMissingValueStrategy(e.target.value)}
                  className={`p-3 border rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="remove">Remove Rows</option>
                  <option value="zero">Fill with Zero</option>
                  <option value="mean">Fill with Mean</option>
                  <option value="mode">Fill with Mode</option>
                </select>
                <button
                  onClick={handleMissingValues}
                  className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Apply Strategy
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current strategy: <span className="font-medium">{missingValueStrategy}</span>
              </p>
            </div>

            {/* Actions */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Actions</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={resetData}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    {ChartBarIcon ? <ChartBarIcon className="h-5 w-5" /> : <FallbackIcon className="h-5 w-5" />}
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={exportCleanedData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    {DocumentArrowDownIcon ? <DocumentArrowDownIcon className="h-5 w-5" /> : <FallbackIcon className="h-5 w-5" />}
                    <span>Export Cleaned Data</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">👁️ Data Preview</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      {Object.keys(cleanedData[0] || {}).map(column => (
                        <th key={column} className="text-left p-3 font-medium">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cleanedData.slice(0, 10).map((row, index) => (
                      <tr key={index} className={`border-b ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="p-3 text-sm">
                            {String(value).substring(0, 50)}
                            {String(value).length > 50 ? '...' : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {cleanedData.length > 10 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Showing first 10 rows of {cleanedData.length} total rows
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Getting Started */}
        {!selectedFile && (
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h3 className="text-lg font-semibold mb-3 text-blue-600">
              💡 Getting Started with Data Cleaning
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>• Upload an Excel file to begin cleaning</li>
              <li>• Rename columns for better organization</li>
              <li>• Filter data based on specific criteria</li>
              <li>• Sort data by any column</li>
              <li>• Handle missing values with various strategies</li>
              <li>• Convert data types as needed</li>
              <li>• Export cleaned data for analysis</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCleaning;