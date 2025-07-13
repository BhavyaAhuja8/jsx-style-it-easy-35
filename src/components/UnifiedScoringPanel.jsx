import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, Edit, Trash2, AlertTriangle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ScoreRuleModal from './ScoreRuleModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useToast } from '@/hooks/useToast';

const UnifiedScoringPanel = () => {
  const [scoreRules, setScoreRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const { toast } = useToast();

  // Filter score rules based on search term
  const filteredRules = scoreRules.filter(rule =>
    rule.parameterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.productId?.toString().includes(searchTerm) ||
    rule.processName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Unified Scoring Panel</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and configure scoring rules for your processes</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search parameters, process, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="icon"
                disabled={loading || refreshing}
                className="border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button 
                onClick={handleAddRule} 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Score Rule
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  : "No rules match your search criteria. Try adjusting your search terms."}
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