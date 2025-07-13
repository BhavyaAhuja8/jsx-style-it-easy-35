import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Edit, Trash2, AlertTriangle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ScoreRuleModal from './ScoreRuleModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useToast } from '@/hooks/useToast';

const UnifiedScoringPanel = () => {
  const [scoreRules, setScoreRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const { toast } = useToast();

  // Filter score rules based on filter type
  const filteredRules = scoreRules.filter(rule => {
    if (filterType === 'all') return true;
    return rule.processName?.toLowerCase().includes(filterType.toLowerCase());
  });

  // Load score rules on component mount
  useEffect(() => {
    loadScoreRules();
  }, []);

  const loadScoreRules = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const data = await apiService.getScores();
      // setScoreRules(data);
      
      // Simulated empty state for now
      setScoreRules([]);
      
      toast({
        title: "Score rules loaded successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Failed to load score rules",
        description: "Please check your connection and try again",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Data refreshed successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Failed to refresh data",
        description: "Please try again",
        variant: "error"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleDeleteRule = (rule) => {
    setDeletingRule(rule);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        // TODO: Replace with actual API call
        // await apiService.updateScore(editingRule.id, ruleData);
        toast({
          title: "Score rule updated successfully",
          description: `Rule "${ruleData.parameterName}" has been updated`,
          variant: "success"
        });
      } else {
        // TODO: Replace with actual API call
        // await apiService.createUnifiedScore(ruleData);
        toast({
          title: "Score rule created successfully",
          description: `Rule "${ruleData.parameterName}" has been created`,
          variant: "success"
        });
      }
      
      setIsModalOpen(false);
      loadScoreRules();
    } catch (error) {
      toast({
        title: editingRule ? "Failed to update score rule" : "Failed to create score rule",
        description: error.message || "Please check your input and try again",
        variant: "error"
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // TODO: Replace with actual API call
      // await apiService.deleteScore(deletingRule.id);
      
      toast({
        title: "Score rule deleted successfully",
        description: `Rule "${deletingRule.parameterName}" has been removed`,
        variant: "success"
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingRule(null);
      loadScoreRules();
    } catch (error) {
      toast({
        title: "Failed to delete score rule",
        description: error.message || "Please try again",
        variant: "error"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Unified Scoring Panel</h1>
              <p className="text-gray-600">Manage and configure scoring rules for your processes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={loading || refreshing}
                className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                onClick={handleAddRule} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Score Rule
              </Button>
            </div>
          </div>
          
          {/* Filter Section */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-64 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200">
                  <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  <SelectItem value="stating term">Stating Term</SelectItem>
                  <SelectItem value="health insurance">Health Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading score rules...</p>
              </div>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Score Rules Found</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {scoreRules.length === 0 
                  ? "Get started by creating your first score rule to begin managing your scoring parameters."
                  : "No rules match your filter criteria. Try adjusting your filter selection."}
              </p>
              {scoreRules.length === 0 && (
                <Button 
                  onClick={handleAddRule} 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Score Rule
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-gray-200">
                    <TableHead className="font-medium text-gray-700 py-4">ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Parameter Name</TableHead>
                    <TableHead className="font-medium text-gray-700">Product ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Process Name</TableHead>
                    <TableHead className="font-medium text-gray-700">Min Value</TableHead>
                    <TableHead className="font-medium text-gray-700">Max Value</TableHead>
                    <TableHead className="font-medium text-gray-700">Score</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                    <TableHead className="font-medium text-gray-700">Updated By</TableHead>
                    <TableHead className="font-medium text-gray-700">Updated On</TableHead>
                    <TableHead className="font-medium text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule, index) => (
                    <TableRow 
                      key={rule.id} 
                      className="border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="font-mono text-sm text-gray-600">{rule.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{rule.parameterName}</TableCell>
                      <TableCell className="text-gray-700">{rule.productId}</TableCell>
                      <TableCell className="text-gray-700">{rule.processName}</TableCell>
                      <TableCell className="text-gray-700">{rule.minValue}</TableCell>
                      <TableCell className="text-gray-700">{rule.maxValue || '—'}</TableCell>
                      <TableCell className="text-gray-700 font-medium">{rule.score}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rule.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{rule.updatedBy}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(rule.updatedOn).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleEditRule(rule)}
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteRule(rule)}
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Modals */}
        <ScoreRuleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRule}
          editingRule={editingRule}
        />

        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          ruleName={deletingRule?.parameterName}
        />
      </div>
    </div>
  );
};

export default UnifiedScoringPanel;