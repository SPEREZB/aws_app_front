import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Student {
    id: number;
    name: string;
    last_name: string;
    age: number;
    semestre: string;
}

const App: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [newStudent, setNewStudent] = useState<Student>({
        id: 0,
        name: '',
        last_name: '',
        age: 18,
        semestre: ''
    });
    const [error, setError] = useState<string>('');
    const [editing, setEditing] = useState<Student | null>(null);

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        if (error) { 
            const timer = setTimeout(() => {
                setError('');
            }, 5000);
 
            return () => clearTimeout(timer);
        }
    }, [error]);

    const getStudents = async () => {
        try {
            const response = await axios.get('/api/students');
            setStudents(response.data);
        } catch (error) {
            setError('Error al obtener el listado de estudiantes');
        }
    };

    const createStudent = async () => {
        try {
            await axios.post('/api/students', newStudent);
            getStudents();
            setNewStudent({ id: 0, name: '',last_name:'', age: 0, semestre: '' });
        } catch (error) {
            setError('Error al crear estudiante');
        }
    };

    const actualizarCampos = (student: Student) => {
        setEditing(student);
    };

    const updateStudent = async () => {
        if (editing) {
            try {
                await axios.put(`/api/students/${editing.id}`, editing);
                getStudents();
                setEditing(null);
            } catch (error) {
                setError('Error al actualizar estudiante');
            }
        }
    };

    const deleteStudent = async (id: number) => {
        try {
            await axios.delete(`/api/students/${id}`);
            getStudents();
        } catch (error) {
            setError('Error al eliminar estudiante');
        }
    };

    return (
        <div className="container mt-4">
        <div className="d-flex justify-content-center">
            <div className="w-75">
                <h1 className="text-center mb-4">LISTADO DE ESTUDIANTES DE SOFTWARE</h1>
 
                <div className="mb-4"> 
                    <form>
                        <div className="d-flex flex-row align-items-center">
                            <div className="form-group me-3">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editing ? editing.name : newStudent.name}
                                    onChange={(e) => {
                                        if (editing) {
                                            setEditing({ ...editing, name: e.target.value });
                                        } else {
                                            setNewStudent({ ...newStudent, name: e.target.value });
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group me-3">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editing ? editing.last_name : newStudent.last_name}
                                    onChange={(e) => {
                                        if (editing) {
                                            setEditing({ ...editing, last_name: e.target.value });
                                        } else {
                                            setNewStudent({ ...newStudent, last_name: e.target.value });
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group me-3">
                                <label>Edad</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={editing ? editing.age : newStudent.age}
                                    onChange={(e) => {
                                        if (editing) {
                                            setEditing({ ...editing, age: parseInt(e.target.value) });
                                        } else {
                                            setNewStudent({ ...newStudent, age: parseInt(e.target.value) });
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group me-3">
                                <label>Semestre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editing ? editing.semestre : newStudent.semestre}
                                    onChange={(e) => {
                                        if (editing) {
                                            setEditing({ ...editing, semestre: e.target.value });
                                        } else {
                                            setNewStudent({ ...newStudent, semestre: e.target.value });
                                        }
                                    }}
                                />
                            </div>
                            <div className="mt-4">
                                {editing ? (
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={updateStudent}
                                    >
                                        Update Student
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={createStudent}
                                    >
                                        Add Student
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
 
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Edad</th>
                                <th>Semestre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.last_name}</td>
                                    <td>{student.age}</td>
                                    <td>{student.semestre}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => actualizarCampos(student)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteStudent(student.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
 
                {error && <div className="alert alert-danger mt-4">{error}</div>}
            </div>
        </div>
    </div>
    );
};
export default App;