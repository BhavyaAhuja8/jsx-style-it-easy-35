import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ScoreRuleModal = ({ isOpen, onClose, onSave, editingRule }) => {
  const [formData, setFormData] = useState({
    parameterName: '',
    operator: '>',
    productId: '',
    processName: '',
    minValue: '',
    maxValue: '',
    score: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const operators = [
    { value: '>', label: 'Greater than (>)' },
    { value: '<', label: 'Less than (<)' },
    { value: '>=', label: 'Greater than or equal (>=)' },
    { value: '<=', label: 'Less than or equal (<=)' },
    { value: '==', label: 'Equal to (==)' },
    { value: '!=', label: 'Not equal (!=)' },
    { value: 'range', label: 'Range' }
  ];

  // Reset form when modal opens/closes or editingRule changes
  useEffect(() => {
    if (isOpen) {
      if (editingRule) {
        setFormData({
          parameterName: editingRule.parameterName || '',
          operator: editingRule.operator || '>',
          productId: editingRule.productId?.toString() || '',
          processName: editingRule.processName || '',
          minValue: editingRule.minValue?.toString() || '',
          maxValue: editingRule.maxValue?.toString() || '',
          score: editingRule.score?.toString() || '',
          isActive: editingRule.isActive !== false
        });
      } else {
        setFormData({
          parameterName: '',
          operator: '>',
          productId: '',
          processName: '',
          minValue: '',
          maxValue: '',
          score: '',
          isActive: true
        });
      }
      setErrors({});
    }
  }, [isOpen, editingRule]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.parameterName.trim()) {
      newErrors.parameterName = 'Parameter name is required';
    }

    if (!formData.productId.trim()) {
      newErrors.productId = 'Product ID is required';
    } else if (isNaN(formData.productId) || formData.productId <= 0) {
      newErrors.productId = 'Product ID must be a positive number';
    }

    if (!formData.processName.trim()) {
      newErrors.processName = 'Process name is required';
    }

    if (!formData.minValue.trim()) {
      newErrors.minValue = 'Min value is required';
    } else if (isNaN(formData.minValue)) {
      newErrors.minValue = 'Min value must be a number';
    }

    if (formData.operator === 'range') {
      if (!formData.maxValue.trim()) {
        newErrors.maxValue = 'Max value is required for range operator';
      } else if (isNaN(formData.maxValue)) {
        newErrors.maxValue = 'Max value must be a number';
      } else if (parseFloat(formData.maxValue) <= parseFloat(formData.minValue)) {
        newErrors.maxValue = 'Max value must be greater than min value';
      }
    }

    if (!formData.score.trim()) {
      newErrors.score = 'Score is required';
    } else if (isNaN(formData.score)) {
      newErrors.score = 'Score must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        productId: parseInt(formData.productId),
        minValue: parseFloat(formData.minValue),
        maxValue: formData.operator === 'range' ? parseFloat(formData.maxValue) : null,
        score: parseFloat(formData.score)
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-xl animate-scale-in">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {editingRule ? 'Edit Score Rule' : 'Add New Score Rule'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={loading}
              className="hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Parameter Name */}
          <div className="space-y-2">
            <Label htmlFor="parameterName" className="text-sm font-medium text-gray-700">
              Parameter Name *
            </Label>
            <Input
              id="parameterName"
              value={formData.parameterName}
              onChange={(e) => handleInputChange('parameterName', e.target.value)}
              placeholder="Enter parameter name"
              className={`transition-all duration-200 ${
                errors.parameterName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.parameterName && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.parameterName}
              </div>
            )}
          </div>

          {/* Operator */}
          <div className="space-y-2">
            <Label htmlFor="operator" className="text-sm font-medium text-gray-700">
              Operator *
            </Label>
            <Select value={formData.operator} onValueChange={(value) => handleInputChange('operator', value)}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value} className="hover:bg-gray-50">
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product ID and Process Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId" className="text-sm font-medium text-gray-700">
                Product ID *
              </Label>
              <Input
                id="productId"
                type="text"
                value={formData.productId}
                onChange={(e) => handleInputChange('productId', e.target.value)}
                placeholder="Enter product ID"
                className={`transition-all duration-200 ${
                  errors.productId 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.productId && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.productId}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="processName" className="text-sm font-medium text-gray-700">
                Process Name *
              </Label>
              <Input
                id="processName"
                value={formData.processName}
                onChange={(e) => handleInputChange('processName', e.target.value)}
                placeholder="Enter process name"
                className={`transition-all duration-200 ${
                  errors.processName 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.processName && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.processName}
                </div>
              )}
            </div>
          </div>

          {/* Values Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minValue" className="text-sm font-medium text-gray-700">
                Min Value *
              </Label>
              <Input
                id="minValue"
                type="text"
                value={formData.minValue}
                onChange={(e) => handleInputChange('minValue', e.target.value)}
                placeholder="Min"
                className={`transition-all duration-200 ${
                  errors.minValue 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.minValue && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.minValue}
                </div>
              )}
            </div>

            {/* Max Value - Only show for range operator */}
            {formData.operator === 'range' && (
              <div className="space-y-2">
                <Label htmlFor="maxValue" className="text-sm font-medium text-gray-700">
                  Max Value *
                </Label>
                <Input
                  id="maxValue"
                  type="text"
                  value={formData.maxValue}
                  onChange={(e) => handleInputChange('maxValue', e.target.value)}
                  placeholder="Max"
                  className={`transition-all duration-200 ${
                    errors.maxValue 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.maxValue && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.maxValue}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="score" className="text-sm font-medium text-gray-700">
                Score *
              </Label>
              <Input
                id="score"
                type="text"
                value={formData.score}
                onChange={(e) => handleInputChange('score', e.target.value)}
                placeholder="Score"
                className={`transition-all duration-200 ${
                  errors.score 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.score && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.score}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <Select 
              value={formData.isActive ? 'active' : 'inactive'} 
              onValueChange={(value) => handleInputChange('isActive', value === 'active')}
            >
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="active" className="hover:bg-gray-50">Active</SelectItem>
                <SelectItem value="inactive" className="hover:bg-gray-50">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                editingRule ? 'Update Rule' : 'Create Score Rule'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreRuleModal;