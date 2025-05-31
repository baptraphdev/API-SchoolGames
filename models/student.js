const { db } = require('../config/firebase');
const { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid');

class Student {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.grade = data.grade;
    this.age = data.age;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Get all students
  static async getAll() {
    try {
      const studentsCollection = collection(db, 'students');
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsList = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return studentsList;
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  }

  // Get student by ID
  static async getById(id) {
    try {
      const studentDoc = doc(db, 'students', id);
      const studentSnapshot = await getDoc(studentDoc);
      
      if (!studentSnapshot.exists()) {
        throw new Error('Student not found');
      }
      
      return {
        id: studentSnapshot.id,
        ...studentSnapshot.data()
      };
    } catch (error) {
      throw new Error(`Error fetching student: ${error.message}`);
    }
  }

  // Create new student
  static async create(studentData) {
    try {
      const student = new Student(studentData);
      const studentsCollection = collection(db, 'students');
      const docRef = await addDoc(studentsCollection, {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        grade: student.grade,
        age: student.age,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      });
      
      return {
        id: docRef.id,
        ...student
      };
    } catch (error) {
      throw new Error(`Error creating student: ${error.message}`);
    }
  }

  // Update student
  static async update(id, studentData) {
    try {
      const studentDoc = doc(db, 'students', id);
      const studentSnapshot = await getDoc(studentDoc);
      
      if (!studentSnapshot.exists()) {
        throw new Error('Student not found');
      }
      
      const updatedStudent = {
        ...studentSnapshot.data(),
        ...studentData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(studentDoc, updatedStudent);
      
      return {
        id,
        ...updatedStudent
      };
    } catch (error) {
      throw new Error(`Error updating student: ${error.message}`);
    }
  }

  // Delete student
  static async delete(id) {
    try {
      const studentDoc = doc(db, 'students', id);
      const studentSnapshot = await getDoc(studentDoc);
      
      if (!studentSnapshot.exists()) {
        throw new Error('Student not found');
      }
      
      await deleteDoc(studentDoc);
      return { id };
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }

  // Find student by email
  static async findByEmail(email) {
    try {
      const studentsCollection = collection(db, 'students');
      const q = query(studentsCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error finding student by email: ${error.message}`);
    }
  }
}

module.exports = Student;