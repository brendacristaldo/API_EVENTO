class Event {
  static events = [];
  static counter = 1;

  static create(eventData) {
    const event = { 
      id: this.counter++, 
      ...eventData,
      guests: [] 
    };
    this.events.push(event);
    return event;
  }

  static findById(id) {
    return this.events.find(event => event.id === id);
  }

  static update(id, eventData) {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) return null;
    this.events[index] = { ...this.events[index], ...eventData };
    return this.events[index];
  }

  static delete(id) {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }

  static findAll() {
    return this.events;
  }

  static findByUserPaginated(userId, limit, offset) {
    return this.findAll()
      .filter(event => event.userId === userId)
      .slice(offset, offset + limit);
  }

  static countByUser(userId) {
    return this.findAll()
      .filter(event => event.userId === userId)
      .length;
  }

  static getGuestCount(id) {
    const event = this.findById(id);
    if (!event) return 0;
    
    const Guest = require('./Guest');
    return Guest.findByEvent(id).length;
  }
}

module.exports = Event;