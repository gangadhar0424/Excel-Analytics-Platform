import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { 
  CpuChipIcon, 
  LightBulbIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AIFeatures = () => {
  console.log('AIFeatures component rendering...');
  
  // Fallback icon component to prevent import errors
  const FallbackIcon = ({ className }) => (
    <div className={`${className} bg-gray-400 rounded`}></div>
  );
  
  try {
    const { isDarkMode } = useTheme();
    const { files } = useSelector(state => state.files);
    
    console.log('Redux state:', { files, isDarkMode });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [aiInsights, setAiInsights] = useState([]);
    const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
    const [queryResult, setQueryResult] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dataSummary, setDataSummary] = useState({});

    useEffect(() => {
      console.log('AIFeatures useEffect triggered:', { selectedFile, files });
      if (selectedFile && files && files.length > 0) {
        const file = files.find(f => f.fileName === selectedFile);
        console.log('Found file:', file);
        if (file && file.data) {
          generateDataSummary(file.data);
          generateAIInsights(file.data);
          detectAnomalies(file.data);
          generatePredictions(file.data);
        }
      }
    }, [selectedFile, files]);

    const generateDataSummary = (data) => {
      console.log('Generating data summary for:', data);
      if (!data || data.length === 0) return;
      
      try {
        const columns = Object.keys(data[0]);
        const numericColumns = columns.filter(key => 
          !isNaN(data[0][key]) && data[0][key] !== ''
        );
        
        const summary = {
          totalRows: data.length,
          totalColumns: columns.length,
          numericColumns: numericColumns.length,
          categoricalColumns: columns.length - numericColumns.length,
          dataQuality: calculateDataQuality(data),
          patterns: detectPatterns(data, numericColumns)
        };
        
        console.log('Generated summary:', summary);
        setDataSummary(summary);
      } catch (error) {
        console.error('Error generating data summary:', error);
      }
    };

    const calculateDataQuality = (data) => {
      if (!data || data.length === 0) return 0;
      
      try {
        let totalCells = 0;
        let missingCells = 0;
        
        data.forEach(row => {
          Object.values(row).forEach(value => {
            totalCells++;
            if (value === '' || value === null || value === undefined) {
              missingCells++;
            }
          });
        });
        
        return ((totalCells - missingCells) / totalCells * 100).toFixed(1);
      } catch (error) {
        console.error('Error calculating data quality:', error);
        return 0;
      }
    };

    const detectPatterns = (data, numericColumns) => {
      const patterns = [];
      
      try {
        numericColumns.forEach(col => {
          const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
          if (values.length > 0) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
            const stdDev = Math.sqrt(variance);
            
            if (stdDev < mean * 0.1) {
              patterns.push(`${col}: Low variability (consistent data)`);
            } else if (stdDev > mean * 0.5) {
              patterns.push(`${col}: High variability (spread out data)`);
            }
            
            const trend = values[values.length - 1] - values[0];
            if (Math.abs(trend) > stdDev) {
              patterns.push(`${col}: ${trend > 0 ? 'Upward' : 'Downward'} trend detected`);
            }
          }
        });
      } catch (error) {
        console.error('Error detecting patterns:', error);
      }
      
      return patterns;
    };

    const generateAIInsights = (data) => {
      if (!data || data.length === 0) return;
      
      try {
        const insights = [];
        const numericColumns = Object.keys(data[0]).filter(key => 
          !isNaN(data[0][key]) && data[0][key] !== ''
        );
        
                 if (data.length > 100) {
           insights.push({
             type: 'info',
             title: 'Large Dataset',
             description: `Your dataset contains ${data.length} rows, providing robust statistical power for analysis.`,
             icon: ChartBarIcon || FallbackIcon
           });
         }
         
         if (numericColumns.length >= 3) {
           insights.push({
             type: 'success',
             title: 'Rich Numeric Data',
             description: `Multiple numeric columns detected. Consider correlation analysis and multivariate visualizations.`,
             icon: ChartBarIcon || FallbackIcon
           });
         }
         
         const quality = calculateDataQuality(data);
         if (quality < 90) {
           insights.push({
             type: 'warning',
             title: 'Data Quality Alert',
             description: `Data completeness is ${quality}%. Consider data cleaning before analysis.`,
             icon: ExclamationTriangleIcon || FallbackIcon
           });
         } else {
           insights.push({
             type: 'success',
             title: 'Excellent Data Quality',
             description: `Your data is ${quality}% complete. Ready for advanced analysis!`,
             icon: CheckCircleIcon || FallbackIcon
           });
         }
        
        setAiInsights(insights);
      } catch (error) {
        console.error('Error generating AI insights:', error);
      }
    };

    const detectAnomalies = (data) => {
      if (!data || data.length === 0) return;
      
      try {
        const anomalies = [];
        const numericColumns = Object.keys(data[0]).filter(key => 
          !isNaN(data[0][key]) && data[0][key] !== ''
        );
        
        numericColumns.forEach(col => {
          const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
          if (values.length > 0) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            
            values.forEach((value, index) => {
              if (Math.abs(value - mean) > 2 * stdDev) {
                anomalies.push({
                  column: col,
                  value: value,
                  row: index + 1,
                  deviation: ((value - mean) / stdDev).toFixed(2),
                  severity: Math.abs(value - mean) / stdDev > 3 ? 'high' : 'medium'
                });
              }
            });
          }
        });
        
        setAnomalies(anomalies);
      } catch (error) {
        console.error('Error detecting anomalies:', error);
      }
    };

    const generatePredictions = (data) => {
      if (!data || data.length === 0) return;
      
      try {
        const predictions = {};
        const numericColumns = Object.keys(data[0]).filter(key => 
          !isNaN(data[0][key]) && data[0][key] !== ''
        );
        
        numericColumns.forEach(col => {
          const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
          if (values.length >= 5) {
            const x = Array.from({ length: values.length }, (_, i) => i);
            const sumX = x.reduce((a, b) => a + b, 0);
            const sumY = values.reduce((a, b) => a + b, 0);
            const sumXY = x.reduce((a, b, i) => a + b * values[i], 0);
            const sumXX = x.reduce((a, b) => a + b * b, 0);
            
            const slope = (values.length * sumXY - sumX * sumY) / (values.length * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / values.length;
            
            const nextValues = [];
            for (let i = 1; i <= 3; i++) {
              const prediction = slope * (values.length + i - 1) + intercept;
              nextValues.push(prediction.toFixed(2));
            }
            
            predictions[col] = {
              trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
              slope: slope.toFixed(4),
              nextValues: nextValues,
              confidence: Math.min(95, Math.max(60, 100 - Math.abs(slope) * 10))
            };
          }
        });
        
        setPredictions(predictions);
      } catch (error) {
        console.error('Error generating predictions:', error);
      }
    };

    const handleNaturalLanguageQuery = async () => {
      if (!naturalLanguageQuery.trim() || !selectedFile) return;
      
      setIsAnalyzing(true);
      
      setTimeout(() => {
        try {
          const query = naturalLanguageQuery.toLowerCase();
          let result = null;
          
          if (query.includes('trend') || query.includes('pattern')) {
            result = {
              type: 'trend',
              title: 'Trend Analysis',
              description: 'Based on your query, here are the key trends in your data:',
              data: Object.entries(predictions).map(([col, pred]) => ({
                column: col,
                trend: pred.trend,
                confidence: pred.confidence
              }))
            };
          } else if (query.includes('outlier') || query.includes('anomaly')) {
            result = {
              type: 'anomalies',
              title: 'Anomaly Detection',
              description: 'Here are the anomalies detected in your data:',
              data: anomalies.slice(0, 5)
            };
          } else {
            result = {
              type: 'general',
              title: 'Data Overview',
              description: 'Here\'s what I found about your data:',
              data: {
                totalRows: dataSummary.totalRows,
                totalColumns: dataSummary.totalColumns,
                dataQuality: dataSummary.dataQuality + '%',
                patterns: dataSummary.patterns?.length || 0
              }
            };
          }
          
          setQueryResult(result);
        } catch (error) {
          console.error('Error processing query:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }, 2000);
    };

    const getInsightIcon = (type) => {
      const iconMap = {
        success: CheckCircleIcon || FallbackIcon,
        warning: ExclamationTriangleIcon || FallbackIcon,
        info: LightBulbIcon || FallbackIcon,
        default: ChartBarIcon || FallbackIcon
      };
      
      return iconMap[type] || iconMap.default;
    };

    const getInsightColor = (type) => {
      switch (type) {
        case 'success':
          return 'text-green-600 bg-green-100 dark:bg-green-900/20';
        case 'warning':
          return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
        case 'info':
          return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
        default:
          return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      }
    };

    console.log('Rendering AIFeatures component with state:', {
      selectedFile,
      aiInsights: aiInsights.length,
      anomalies: anomalies.length,
      predictions: Object.keys(predictions).length,
      dataSummary
    });

    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              🤖 AI-Powered Features
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get automated insights, detect anomalies, and make predictions with AI
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
              <option value="">Choose a file for AI analysis</option>
              {files && files.map(file => (
                <option key={file.fileName} value={file.fileName}>
                  {file.fileName}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Available files: {files ? files.length : 0}
            </p>
          </div>

          {selectedFile && (
            <>
              {/* AI Insights */}
              <div className={`p-6 rounded-xl mb-8 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className="text-xl font-semibold mb-4">💡 AI-Generated Insights</h2>
                {aiInsights.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {aiInsights.map((insight, index) => {
                       const IconComponent = getInsightIcon(insight.type);
                       return (
                         <div key={index} className={`p-4 rounded-lg border ${
                           isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                         }`}>
                           <div className="flex items-start space-x-3">
                             <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                               {IconComponent ? <IconComponent className="h-5 w-5" /> : <FallbackIcon className="h-5 w-5" />}
                             </div>
                             <div className="flex-1">
                               <h3 className="font-semibold mb-2">{insight.title}</h3>
                               <p className="text-sm text-gray-600 dark:text-gray-400">
                                 {insight.description}
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No insights generated yet. Select a file to begin AI analysis.
                  </p>
                )}
              </div>

              {/* Natural Language Query */}
              <div className={`p-6 rounded-xl mb-8 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className="text-xl font-semibold mb-4">🔍 Natural Language Query</h2>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Ask about your data (e.g., 'Show me trends', 'Find outliers')"
                      value={naturalLanguageQuery}
                      onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                      className={`flex-1 p-3 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={handleNaturalLanguageQuery}
                      disabled={isAnalyzing || !naturalLanguageQuery.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                                               <>
                         {CpuChipIcon ? <CpuChipIcon className="h-5 w-5" /> : <FallbackIcon className="h-5 w-5" />}
                         <span>Ask AI</span>
                       </>
                      )}
                    </button>
                  </div>
                  
                  {queryResult && (
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                    }`}>
                      <h3 className="font-semibold mb-2 text-blue-600">{queryResult.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {queryResult.description}
                      </p>
                      {queryResult.type === 'trend' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {queryResult.data.map((item, index) => (
                            <div key={index} className={`p-3 rounded-lg ${
                              isDarkMode ? 'bg-gray-600' : 'bg-white'
                            }`}>
                              <p className="font-medium">{item.column}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Trend: {item.trend}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Confidence: {item.confidence}%
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {queryResult.type === 'anomalies' && (
                        <div className="space-y-2">
                          {queryResult.data.map((anomaly, index) => (
                            <div key={index} className={`p-2 rounded ${
                              isDarkMode ? 'bg-gray-600' : 'bg-white'
                            }`}>
                              <p className="text-sm">
                                <span className="font-medium">{anomaly.column}</span> - 
                                Row {anomaly.row}: {anomaly.value} 
                                (Deviation: {anomaly.deviation}σ)
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {queryResult.type === 'general' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(queryResult.data).map(([key, value]) => (
                            <div key={key} className={`p-3 rounded-lg ${
                              isDarkMode ? 'bg-gray-600' : 'bg-white'
                            }`}>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{key}</p>
                              <p className="font-medium">{value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Anomaly Detection */}
              <div className={`p-6 rounded-xl mb-8 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className="text-xl font-semibold mb-4">⚠️ Anomaly Detection</h2>
                {anomalies.length > 0 ? (
                  <div className="space-y-3">
                    {anomalies.slice(0, 10).map((anomaly, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        anomaly.severity === 'high' 
                          ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                          : 'border-orange-300 bg-orange-50 dark:bg-orange-900/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {anomaly.column} - Row {anomaly.row}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Value: {anomaly.value} | Deviation: {anomaly.deviation}σ
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            anomaly.severity === 'high' 
                              ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' 
                              : 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
                          }`}>
                            {anomaly.severity} severity
                          </span>
                        </div>
                      </div>
                    ))}
                    {anomalies.length > 10 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Showing first 10 anomalies of {anomalies.length} total
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No anomalies detected in your data
                  </p>
                )}
              </div>

              {/* Predictive Analytics */}
              <div className={`p-6 rounded-xl mb-8 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className="text-xl font-semibold mb-4">🔮 Predictive Analytics</h2>
                {Object.keys(predictions).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(predictions).map(([column, pred]) => (
                      <div key={column} className={`p-4 rounded-lg border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <h3 className="font-semibold mb-3 text-blue-600">{column}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Trend:</span>
                            <span className={`font-medium ${
                              pred.trend === 'increasing' ? 'text-green-600' : 
                              pred.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {pred.trend}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span className="font-medium">{pred.confidence}%</span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Next 3 predictions:</p>
                            <div className="flex space-x-2">
                              {pred.nextValues.map((value, index) => (
                                <span key={index} className={`px-2 py-1 text-xs rounded ${
                                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                                }`}>
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No predictions available. Need at least 5 data points per column.
                  </p>
                )}
              </div>

              {/* Data Summary */}
              <div className={`p-6 rounded-xl mb-8 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className="text-xl font-semibold mb-4">📊 AI Data Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Data Quality</p>
                    <p className="text-2xl font-bold text-blue-600">{dataSummary.dataQuality || 0}%</p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Patterns Found</p>
                    <p className="text-2xl font-bold text-green-600">{dataSummary.patterns?.length || 0}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Anomalies</p>
                    <p className="text-2xl font-bold text-orange-600">{anomalies.length}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Predictions</p>
                    <p className="text-2xl font-bold text-purple-600">{Object.keys(predictions).length}</p>
                  </div>
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
                💡 Getting Started with AI Features
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• Upload an Excel file to enable AI analysis</li>
                <li>• Get automated insights about your data</li>
                <li>• Ask questions in natural language</li>
                <li>• Detect anomalies and outliers automatically</li>
                <li>• Generate predictions based on trends</li>
                <li>• Explore data patterns and relationships</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering AIFeatures component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-800 dark:text-gray-200">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-lg mb-4">
            An unexpected error occurred while rendering the AI Features page.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }
};

export default AIFeatures; 