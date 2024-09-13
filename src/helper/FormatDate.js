export function FormatDateTime(dateString) {

    // Parse date string
    const date = new Date(dateString);
  
    // Get date parts
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
  
    // Get time parts 
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
  
    // 12 hour format
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    // Format
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
  
    return `${month} ${day} ${year} / ${hours}:${minutes} ${ampm}`
  }
  