
import { AttendanceRecord } from '../types';

const firstNames = ["Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gustavo", "Helena", "Igor", "Juliana", "Lucas", "Mariana", "Nelson", "Olivia", "Paulo", "Quintino", "Raquel", "Sofia", "Thiago", "Ursula"];
const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida"];

const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const registeredStudents = Array.from({ length: 20 }, () => {
    const fullName = generateRandomName();
    const email = `${fullName.toLowerCase().replace(' ', '.')}@example.com`;
    return { fullName, email };
});


const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

let recordIdCounter = 0;

export const generateInitialData = (count: number): AttendanceRecord[] => {
  const data: AttendanceRecord[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 3);

  for (let i = 0; i < count; i++) {
    const student = registeredStudents[Math.floor(Math.random() * registeredStudents.length)];
    data.push({
      id: recordIdCounter++,
      fullName: student.fullName,
      email: student.email,
      responseDate: generateRandomDate(startDate, endDate),
    });
  }
  return data.sort((a, b) => a.responseDate.getTime() - b.responseDate.getTime());
};

export const generateNewRecord = (): AttendanceRecord => {
  const student = registeredStudents[Math.floor(Math.random() * registeredStudents.length)];
  return {
    id: recordIdCounter++,
    fullName: student.fullName,
    email: student.email,
    responseDate: new Date(),
  };
};
