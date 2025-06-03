export const getFormattedPeopleCount = (count: number) => {
    const remainder10 = count % 10;
    const remainder100 = count % 100;
  
    if (remainder100 >= 11 && remainder100 <= 19) {
      return `${count} человек`;
    } else if (remainder10 === 1) {
      return `${count} человек`;
    } else if (remainder10 >= 2 && remainder10 <= 4) {
      return `${count} человека`;
    }
  
    return `${count} человек`;
  };
  
  export const getFormattedHoursCount = (count: number) => {
    const remainder10 = count % 10;
    const remainder100 = count % 100;
  
    if (remainder100 >= 11 && remainder100 <= 19) {
      return `${count} академ. часов`;
    } else if (remainder10 === 1) {
      return `${count} академ. час`;
    } else if (remainder10 >= 2 && remainder10 <= 4) {
      return `${count} академ. часа`;
    }
  
    return `${count} академ. часов`;
  };

  export const getFormattedPhotosCount = (count: number) => {
    const remainder10 = count % 10;
    const remainder100 = count % 100;
  
    if (remainder100 >= 11 && remainder100 <= 19) {
      return `${count} фотографий`;
    } else if (remainder10 === 1) {
      return `${count} фотография`;
    } else if (remainder10 >= 2 && remainder10 <= 4) {
      return `${count} фотографии`;
    }
  
    return `${count} фотографий`;
  };