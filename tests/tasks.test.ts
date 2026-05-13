import request from 'supertest';
import app from '../src/app';

interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

interface ValidationDetail {
  path: Array<string | number>;
  keys?: string[];
}

const createTask = async (
  title: string,
  overrides: Partial<Pick<TaskResponse, 'description' | 'status'>> = {},
): Promise<TaskResponse> => {
  const res = await request(app)
    .post('/tasks')
    .send({ title, ...overrides });

  expect(res.status).toBe(201);
  return res.body as TaskResponse;
};

const getValidationPaths = (details: ValidationDetail[]): string[] => {
  return details.map((detail) => detail.path.join('.'));
};

describe('GET /tasks', () => {
  it('returns tasks', async () => {
    // Arrange
    const task = await createTask('List visible task');

    // Act
    const res = await request(app).get('/tasks');

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: task.id,
          title: task.title,
          status: 'todo',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });
});

describe('POST /tasks', () => {
  it('creates a task with valid input', async () => {
    // Arrange
    const body = {
      title: 'Write task tests',
      description: 'Cover every CRUD route',
      status: 'in_progress',
    };

    // Act
    const res = await request(app).post('/tasks').send(body);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(body);
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.body.createdAt).toEqual(expect.any(String));
    expect(res.body.updatedAt).toEqual(res.body.createdAt);
  });

  it('returns validation errors for invalid input', async () => {
    // Arrange
    const body = {
      title: '',
      status: 'blocked',
      priority: 'high',
    };

    // Act
    const res = await request(app).post('/tasks').send(body);

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid task payload');
    expect(res.body.details).toEqual(expect.any(Array));
    expect(getValidationPaths(res.body.details)).toEqual(
      expect.arrayContaining(['title', 'status', '']),
    );
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keys: expect.arrayContaining(['priority']),
        }),
      ]),
    );
  });

  it('returns a structured error for malformed JSON', async () => {
    // Arrange
    const malformedJson = '{"title":';

    // Act
    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send(malformedJson);

    // Assert
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid JSON' });
  });
});

describe('GET /tasks/:id', () => {
  it('returns a task by id', async () => {
    // Arrange
    const task = await createTask('Fetch by id task', {
      description: 'Created for GET by id',
    });

    // Act
    const res = await request(app).get(`/tasks/${task.id}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(task);
  });

  it('returns 404 for an unknown task id', async () => {
    // Arrange
    const id = 'missing-task-id';

    // Act
    const res = await request(app).get(`/tasks/${id}`);

    // Assert
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });
});

describe('PUT /tasks/:id', () => {
  it('updates a task with valid input', async () => {
    // Arrange
    const task = await createTask('Original task');
    const body = {
      title: 'Updated task',
      description: 'Updated description',
      status: 'done',
    };

    // Act
    const res = await request(app).put(`/tasks/${task.id}`).send(body);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: task.id,
      ...body,
      createdAt: task.createdAt,
    });
    expect(Date.parse(res.body.updatedAt)).toBeGreaterThanOrEqual(
      Date.parse(task.updatedAt),
    );
  });

  it('returns validation errors for invalid input', async () => {
    // Arrange
    const task = await createTask('Invalid update target');
    const body = { title: 'x'.repeat(201) };

    // Act
    const res = await request(app).put(`/tasks/${task.id}`).send(body);

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid task payload');
    expect(res.body.details).toEqual(expect.any(Array));
    expect(getValidationPaths(res.body.details)).toEqual(
      expect.arrayContaining(['title']),
    );
  });

  it('returns 404 for an unknown task id', async () => {
    // Arrange
    const body = { title: 'Update missing task' };

    // Act
    const res = await request(app).put('/tasks/missing-task-id').send(body);

    // Assert
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });
});

describe('DELETE /tasks/:id', () => {
  it('deletes a task', async () => {
    // Arrange
    const task = await createTask('Delete me');

    // Act
    const res = await request(app).delete(`/tasks/${task.id}`);
    const getRes = await request(app).get(`/tasks/${task.id}`);

    // Assert
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(getRes.status).toBe(404);
  });

  it('returns 404 for an unknown task id', async () => {
    // Arrange
    const id = 'missing-task-id';

    // Act
    const res = await request(app).delete(`/tasks/${id}`);

    // Assert
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });
});
