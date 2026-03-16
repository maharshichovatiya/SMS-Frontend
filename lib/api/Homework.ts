import api from "../Axios";
import {
  CreateHomeworkPayload,
  CreateHomeworkResponse,
  Homework,
  HomeworkListResponse,
  HomeworkResponse,
  AssignToClassesPayload,
  AssignToStudentsPayload,
  AssignResponse,
} from "../types/Homework";

export type {
  Homework,
  HomeworkListResponse,
  CreateHomeworkPayload,
  CreateHomeworkResponse,
  AssignToClassesPayload,
  AssignToStudentsPayload,
  AssignResponse,
};

const filterEmptyOptionalFields = (data: Partial<CreateHomeworkPayload>) => {
  const filteredData: Record<string, unknown> = {};

  Object.keys(data).forEach(key => {
    const value = data[key as keyof typeof data];

    if (value !== "" && value !== null && value !== undefined) {
      filteredData[key] = value;
    }
  });

  return filteredData;
};

export const homeworkApis = {
  getAll: async () => {
    const res = await api.get<HomeworkListResponse>("/homework");
    return res.data;
  },

  getById: async (homeworkId: string) => {
    const res = await api.get<HomeworkResponse>(`/homework/${homeworkId}`);
    return res.data;
  },

  create: async (data: CreateHomeworkPayload) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("assignedDate", data.assignedDate);
    formData.append("dueDate", data.dueDate);

    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.classno) {
      formData.append("classno", data.classno);
    }
    if (data.instructions) {
      formData.append("instructions", data.instructions);
    }
    if (data.chapterId) {
      formData.append("chapterId", data.chapterId);
    }

    if (data.assignToClasses && data.assignToClasses.length > 0) {
      formData.append("assignToClasses", JSON.stringify(data.assignToClasses));
    }
    if (data.assignToStudents && data.assignToStudents.length > 0) {
      formData.append(
        "assignToStudents",
        JSON.stringify(data.assignToStudents),
      );
    }

    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach(file => {
        formData.append("attachments", file);
      });
    }

    const res = await api.post<CreateHomeworkResponse>("/homework", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  update: async (homeworkId: string, data: Partial<CreateHomeworkPayload>) => {
    const filteredData = filterEmptyOptionalFields(data);
    const res = await api.put<HomeworkResponse>(
      `/homework/${homeworkId}`,
      filteredData,
    );
    return res.data;
  },

  delete: async (homeworkId: string) => {
    const res = await api.delete(`/homework/${homeworkId}`);
    return res.data;
  },

  assignToClasses: async (homeworkId: string, data: AssignToClassesPayload) => {
    const res = await api.post<AssignResponse>(
      `/homework/${homeworkId}/assign-class`,
      data,
    );
    return res.data;
  },

  assignToStudents: async (
    homeworkId: string,
    data: AssignToStudentsPayload,
  ) => {
    const res = await api.post<AssignResponse>(
      `/homework/${homeworkId}/assign-students`,
      data,
    );
    return res.data;
  },
};
