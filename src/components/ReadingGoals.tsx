import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import axios from "axios";

interface ReadingGoal {
    id: number;
    targetBooks: number;
    currentBooks: number;
    startDate: string;
    endDate: string;
    title: string;
    description: string;
    completed: boolean;
    goalType: "YEARLY" | "MONTHLY" | "CUSTOM";
}

interface ReadingGoalFormData {
    title: string;
    targetBooks: number;
    startDate: string;
    endDate: string;
    description: string;
    goalType: "YEARLY" | "MONTHLY" | "CUSTOM";
}

const GoalCard = ({ goal, onDelete, onEdit }: {
    goal: ReadingGoal,
    onDelete: (id: number) => void,
    onEdit: (goal: ReadingGoal) => void
}) => {
    const getProgressBarVariant = (percentage: number) => {
        if (percentage < 25) return "danger";
        if (percentage < 50) return "warning";
        if (percentage < 75) return "info";
        return "success";
    };

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), "d MMMM yyyy", { locale: ru });
        } catch (e) {
            return dateString;
        }
    };

    function calculateReadingProgress(goal: ReadingGoal): number {
        if (goal.targetBooks === 0) {
            return 0;
        }
        return (goal.currentBooks / goal.targetBooks) * 100;
    }

    const calculateRemainingDays = () => {
        const today = new Date();
        const endDate = parseISO(goal.endDate);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const remainingDays = calculateRemainingDays();

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0" style={{padding: '5px'}}>{goal.title}</h5>
                    <Badge style={{margin: '5px'}} bg={goal.completed ? "success" : (remainingDays < 0 ? "danger" : "primary")}>
                        {goal.completed
                            ? "Выполнена"
                            : (remainingDays < 0
                                ? "Просрочена"
                                : `${remainingDays} дн. осталось`)}
                    </Badge>
                </div>
                <div>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => onEdit(goal)}
                    >
                        Редактировать
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(goal.id)}
                    >
                        Удалить
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                <p className="text-muted mb-2">
                    {goal.description || "Нет описания"}
                </p>

                <div className="d-flex justify-content-between mb-1">
                    <span>Прогресс: {goal.currentBooks} из {goal.targetBooks} книг</span>
                    <span>{Math.round(calculateReadingProgress(goal))}%</span>
                </div>

                <ProgressBar
                    variant={getProgressBarVariant(calculateReadingProgress(goal))}
                    now={calculateReadingProgress(goal)}
                    className="mb-3"
                    style={{ height: "10px" }}
                />

                <div className="d-flex justify-content-between text-muted small">
          <span>
            <strong>Начало:</strong> {formatDate(goal.startDate)}
          </span>
                    <span>
            <strong>Конец:</strong> {formatDate(goal.endDate)}
          </span>
                </div>
            </Card.Body>
        </Card>
    );
};

const GoalFormModal = ({
                           show,
                           handleClose,
                           handleSubmit,
                           initialData
                       }: {
    show: boolean,
    handleClose: () => void,
    handleSubmit: (formData: ReadingGoalFormData) => void,
    initialData?: ReadingGoal
}) => {
    const [formData, setFormData] = useState<ReadingGoalFormData>({
        title: "",
        targetBooks: 12,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
        description: "",
        goalType: "YEARLY"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                targetBooks: initialData.targetBooks,
                startDate: initialData.startDate,
                endDate: initialData.endDate,
                description: initialData.description || "",
                goalType: initialData.goalType
            });
        } else {
            setFormData({
                title: "",
                targetBooks: 12,
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
                description: "",
                goalType: "YEARLY"
            });
        }
    }, [initialData, show]);

    const handleGoalTypeChange = (type: "YEARLY" | "MONTHLY" | "CUSTOM") => {
        const today = new Date();
        let startDate = today.toISOString();
        let endDate = "";
        let title = "";

        if (type === "YEARLY") {
            title = `Цель на ${today.getFullYear()} год`;
            endDate = new Date(today.getFullYear(), 11, 31).toISOString();
        } else if (type === "MONTHLY") {
            const monthNames = [
                "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
            ];
            title = `Цель на ${monthNames[today.getMonth()]}`;
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
        }

        setFormData(prev => ({
            ...prev,
            title: title,
            startDate: startDate,
            endDate: endDate,
            goalType: type
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {initialData ? "Редактировать цель" : "Добавить цель чтения"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Тип цели</Form.Label>
                        <Form.Select
                            name="goalType"
                            value={formData.goalType}
                            onChange={(e) => handleGoalTypeChange(e.target.value as any)}
                        >
                            <option value="YEARLY">Годовая</option>
                            <option value="MONTHLY">Месячная</option>
                            <option value="CUSTOM">Произвольная</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Название цели</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Например: Прочитать классику"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Количество книг</Form.Label>
                        <Form.Control
                            type="number"
                            name="targetBooks"
                            min="1"
                            value={formData.targetBooks}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>Дата начала</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate.split('T')[0]}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Дата окончания</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate.split('T')[0]}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Описание (необязательно)</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Дополнительная информация о вашей цели"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Отмена
                </Button>
                <Button
                    variant="primary"
                    onClick={() => handleSubmit(formData)}
                >
                    {initialData ? "Сохранить изменения" : "Создать цель"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ReadingGoals = () => {
    const [goals, setGoals] = useState<ReadingGoal[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentGoal, setCurrentGoal] = useState<ReadingGoal | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        setIsLoading(true);
        try {
            const headers = {withCredentials: true};
            const response = await axios.get(`http://localhost:8080/goals`, headers);

            if (response.status === 200) {
                const data = await response.data;
                if (data != null) {
                    setGoals(data);
                }
            } else {
                console.error('Ошибка при загрузке целей:', response.status);
            }
        } catch (error) {
            console.error('Ошибка при загрузке целей:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createGoal = async (formData: ReadingGoalFormData) => {
        try {
            const query = {
                "title": formData.title,
                "targetBooks": formData.targetBooks,
                "startDate": new Date(formData.startDate).toISOString(),
                "endDate": new Date(formData.endDate).toISOString(),
                "goalType": formData.goalType,
                "description": formData.description,
            }
            console.log(query)

            const headers = { headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true};

            const response = await axios.post(`http://localhost:8080/goals`, query, headers);

            if (response.status === 200) {
                const newGoal = await response.data;
                setGoals(prev => [...prev, newGoal]);
                setShowModal(false);
            } else {
                console.error('Ошибка при создании цели:', response.status);
            }
        } catch (error) {
            console.error('Ошибка при создании цели:', error);
        }
    };

    const updateGoal = async (formData: ReadingGoalFormData) => {
        if (!currentGoal) return;

        try {
            const response = await fetch(`http://localhost:8080/goals/${currentGoal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedGoal = await response.json();
                setGoals(prev => prev.map(goal =>
                    goal.id === updatedGoal.id ? updatedGoal : goal
                ));
                setShowModal(false);
                setCurrentGoal(undefined);
            } else {
                console.error('Ошибка при обновлении цели:', response.status);
            }
        } catch (error) {
            console.error('Ошибка при обновлении цели:', error);
        }
    };

    const deleteGoal = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту цель?')) return;

        try {
            const headers = {withCredentials: true};
            const response = await axios.delete(`http://localhost:8080/goals/${id}`, headers);

            if (response.status === 200) {
                setGoals(prev => prev.filter(goal => goal.id !== id));
            } else {
                console.error('Ошибка при удалении цели:', response.status);
            }
        } catch (error) {
            console.error('Ошибка при удалении цели:', error);
        }
    };

    const handleOpenModal = () => {
        setCurrentGoal(undefined);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentGoal(undefined);
    };

    const handleSubmit = (formData: ReadingGoalFormData) => {
        if (currentGoal) {
            updateGoal(formData);
        } else {
            createGoal(formData);
        }
    };

    const handleEdit = (goal: ReadingGoal) => {
        setCurrentGoal(goal);
        setShowModal(true);
    };

    const activeGoals = goals.filter(goal => !goal.completed);
    const completedGoals = goals.filter(goal => goal.completed);

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Цели чтения</h2>
                <Button variant="primary" onClick={handleOpenModal}>
                    Добавить цель
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            ) : (
                <>
                    {activeGoals.length === 0 && completedGoals.length === 0 ? (
                        <Card className="text-center p-5 shadow-sm">
                            <Card.Body>
                                <h5>У вас пока нет целей чтения</h5>
                                <p className="text-muted">
                                    Создайте свою первую цель, чтобы отслеживать прогресс чтения
                                </p>
                                <Button variant="primary" onClick={handleOpenModal}>
                                    Создать цель
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Row>
                            <Col md={6}>
                                <h5>Активные цели ({activeGoals.length})</h5>
                                {activeGoals.length > 0 ? (
                                    activeGoals.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            onDelete={deleteGoal}
                                            onEdit={handleEdit}
                                        />
                                    ))
                                ) : (
                                    <p className="text-muted">Нет активных целей</p>
                                )}
                            </Col>
                            <Col md={6}>
                                <h5>Выполненные цели ({completedGoals.length})</h5>
                                {completedGoals.length > 0 ? (
                                    completedGoals.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            onDelete={deleteGoal}
                                            onEdit={handleEdit}
                                        />
                                    ))
                                ) : (
                                    <p className="text-muted">Нет выполненных целей</p>
                                )}
                            </Col>
                        </Row>
                    )}
                </>
            )}

            <GoalFormModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSubmit={handleSubmit}
                initialData={currentGoal}
            />
        </Container>
    );
};

export default ReadingGoals;