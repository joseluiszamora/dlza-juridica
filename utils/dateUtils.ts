// utils/dateUtils.js

/**
 * Formatea una fecha ISO en un formato legible
 * @param {string} dateString - Fecha en formato ISO (ej: 2025-01-01T00:00:00.000Z)
 * @param {string} format - Formato deseado (short, medium, long, full, time, datetime, relative)
 * @returns {string} Fecha formateada
 */
export function formatDate(dateString: string, format = 'medium') {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'es-ES';
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString(locale);
      case 'medium':
        return date.toLocaleDateString(locale, { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      case 'long':
        return date.toLocaleDateString(locale, { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      case 'full':
        return date.toLocaleDateString(locale, { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      case 'time':
        return date.toLocaleTimeString(locale, { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      case 'datetime':
        return `${date.toLocaleDateString(locale, { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })} a las ${date.toLocaleTimeString(locale, { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      case 'relative':
        return getRelativeTimeString(date, locale);
      default:
        return date.toLocaleDateString(locale);
    }
  } catch (error) {
    console.error("Error al formatear la fecha:", error);
    return 'Error en fecha';
  }
}

function getRelativeTimeString(date: number | Date, locale: Intl.LocalesArgument) {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Intentar usar Intl.RelativeTimeFormat si está disponible
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
    if (diffMins < 60) return rtf.format(-diffMins, 'minute');
    if (diffHours < 24) return rtf.format(-diffHours, 'hour');
    if (diffDays < 30) return rtf.format(-diffDays, 'day');
    if (diffMonths < 12) return rtf.format(-diffMonths, 'month');
    return rtf.format(-diffYears, 'year');
  }
  
  // Fallback para navegadores que no soporten Intl.RelativeTimeFormat
  if (diffSecs < 60) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays < 30) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  if (diffMonths < 12) return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
  return `Hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
}