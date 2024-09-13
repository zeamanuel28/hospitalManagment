export function FormatDay(dateString) {

    // Parse date string
    const date = new Date(dateString);
  
    // Get date parts
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${month} ${day} ${year}`
  }
  