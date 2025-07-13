// Custom useToast hook - enhanced with better console logging

export const useToast = () => {
  const toast = ({ title, description, variant = "default" }) => {
    // TODO: Implement your custom toast logic here
    // This could use a toast library, context, or any other approach
    
    const styles = {
      success: 'color: green; font-weight: bold;',
      error: 'color: red; font-weight: bold;',
      default: 'color: blue; font-weight: bold;'
    };
    
    const style = styles[variant] || styles.default;
    console.log(`%c🔔 Toast: ${title}`, style);
    
    if (description) {
      console.log(`   ${description}`);
    }
  };

  return { toast };
};