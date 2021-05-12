import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

//TODO: remove this
const initialState = {
  projects: [],
  status: "idle",
  error: null,
};

export const fetchProjects = (token) =>
  createAsyncThunk(
    "projects/fetchProjects",

    async () => {
      console.log("here");
      const response = await axios.get(
        "http://127.0.0.1:8002/api/v1/projects/",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    }
  );

/* export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/posts', { post: initialPost })
    return response.post
  }
) */

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectUpdated(state, action) {
      /* const { id, title, content } = action.payload
      const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      } */
    },
  },
  extraReducers: {
    [fetchProjects.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchProjects.fulfilled]: (state, action) => {
      state.status = "succeeded";
      console.log(action.payload);
      state.projects = state.projects.concat(action.payload);
    },
    [fetchProjects.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { projectUpdated } = projectsSlice.actions;

export default projectsSlice.reducer;

export const selectAllProjects = (state) => state.projects.projects;

export const selectProjectById = (state, projectId) =>
  state.projects.projects.find((project) => project.id === projectId);
