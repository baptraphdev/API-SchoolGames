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

class Teacher {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.subject = data.subject;
    this.department = data.department;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Get all teachers
  static async getAll() {
    try {
      const teachersCollection = collection(db, 'teachers');
      const teachersSnapshot = await getDocs(teachersCollection);
      const teachersList = teachersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return teachersList;
    } catch (error) {
      throw new Error(`Error fetching teachers: ${error.message}`);
    }
  }

  // Get teacher by ID
  static async getById(id) {
    try {
      const teacherDoc = doc(db, 'teachers', id);
      const teacherSnapshot = await getDoc(teacherDoc);
      
      if (!teacherSnapshot.exists()) {
        throw new Error('Teacher not found');
      }
      
      return {
        id: teacherSnapshot.id,
        ...teacherSnapshot.data()
      };
    } catch (error) {
      throw new Error(`Error fetching teacher: ${error.message}`);
    }
  }

  // Create new teacher
  static async create(teacherData) {
    try {
      const teacher = new Teacher(teacherData);
      const teachersCollection = collection(db, 'teachers');
      const docRef = await addDoc(teachersCollection, {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        subject: teacher.subject,
        department: teacher.department,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
      });
      
      return {
        id: docRef.id,
        ...teacher
      };
    } catch (error) {
      throw new Error(`Error creating teacher: ${error.message}`);
    }
  }

  // Update teacher
  static async update(id, teacherData) {
    try {
      const teacherDoc = doc(db, 'teachers', id);
      const teacherSnapshot = await getDoc(teacherDoc);
      
      if (!teacherSnapshot.exists()) {
        throw new Error('Teacher not found');
      }
      
      const updatedTeacher = {
        ...teacherSnapshot.data(),
        ...teacherData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(teacherDoc, updatedTeacher);
      
      return {
        id,
        ...updatedTeacher
      };
    } catch (error) {
      throw new Error(`Error updating teacher: ${error.message}`);
    }
  }

  // Delete teacher
  static async delete(id) {
    try {
      const teacherDoc = doc(db, 'teachers', id);
      const teacherSnapshot = await getDoc(teacherDoc);
      
      if (!teacherSnapshot.exists()) {
        throw new Error('Teacher not found');
      }
      
      await deleteDoc(teacherDoc);
      return { id };
    } catch (error) {
      throw new Error(`Error deleting teacher: ${error.message}`);
    }
  }

  // Find teacher by email
  static async findByEmail(email) {
    try {
      const teachersCollection = collection(db, 'teachers');
      const q = query(teachersCollection, where('email', '==', email));
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
      throw new Error(`Error finding teacher by email: ${error.message}`);
    }
  }
}

module.exports = Teacher;