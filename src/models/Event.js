// Simulação do modelo de evento
class Event {
  static events = [];
  static counter = 1;

  static create(eventData) {
    const event = { id: this.counter++, ...eventData };
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
}

module.exports = Event;