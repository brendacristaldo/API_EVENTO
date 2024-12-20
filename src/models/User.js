// Simulação do modelo de usuário (em um cenário real seria um Schema do Mongoose)
class User {
  static users = [];
  static counter = 1;

  static create(userData) {
    const user = { id: this.counter++, ...userData };
    this.users.push(user);
    return user;
  }

  static findById(id) {
    return this.users.find(user => user.id === id);
  }

  static findByUsername(username) {
    return this.users.find(user => user.username === username);
  }

  static update(id, userData) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
  }

  static delete(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  static findAll() {
    return this.users;
  }
}

module.exports = User;