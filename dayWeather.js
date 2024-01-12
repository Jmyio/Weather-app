class dayWeather {
    constructor() {
        this.day = '';
        this.icon_url = '';
        this.highestTemp = 0;
        this.lowestTemp = 0;
    }

    toWeekday(date) {
        const dateObject = new Date(date);
        const dayIndex = dateObject.getDay();
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekdayName = weekdays[dayIndex];
        return weekdayName;
    }
}