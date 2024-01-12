class hourWeather {
    constructor() {
        this.time = '';
        this.icon_url = '';
        this.temperature = 0;
    }

    formattedTime(inputTime) {
        const [date, time] = inputTime.split(' ');
        const [hour, minute] = time.split(':');
        const formattedHour = this.#formatHour(parseInt(hour, 10));

        return `${formattedHour}${hour < 12 ? 'AM' : 'PM'}`;
    }

    #formatHour(hour) {
        if (hour === 0) {
            return 12;
        } else if (hour > 12) {
            return hour - 12;
        } else {
            return hour;
        }
    }
}