
class Guest {
    static guests = [];
    static counter = 1;
  
    static create(guestData) {
      const guest = { id: this.counter++, ...guestData };
      this.guests.push(guest);
      return guest;
    }
  
    static findById(id) {
      return this.guests.find(guest => guest.id === id);
    }
  
    static update(id, guestData) {
      const index = this.guests.findIndex(guest => guest.id === id);
      if (index === -1) return null;
      this.guests[index] = { ...this.guests[index], ...guestData };
      return this.guests[index];
    }
  
    static delete(id) {
      const index = this.guests.findIndex(guest => guest.id === id);
      if (index === -1) return false;
      this.guests.splice(index, 1);
      return true;
    }
  
    static findByEvent(eventId) {
      return this.guests.filter(guest => guest.eventId === eventId);
    }
  }
  
  module.exports = Guest;