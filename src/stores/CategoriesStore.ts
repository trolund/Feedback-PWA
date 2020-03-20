import { decorate, observable } from "mobx";
import states from "./requestState";
import authService from "../components/api-authorization/AuthorizeService";
import { createContext } from "react";
import ApiRoutes from "../api/ApiRoutes";
import Category from "../models/Category";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_BASE_URL : "";

class CategoriesStore {
  // status
  state = states.DONE;
  msg = "";

  // data
  categories: Category[] | null = null;

  async fetchCategories(companyId: string) {
    this.state = states.LOADING;
    try {
      const url = ApiRoutes.Categories(companyId);

      const token = await authService.getAccessToken();

      const response = await fetch(url, {
        method: "GET",
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
        redirect: "follow"
      });
      this.msg = response.statusText;

      const data: Category[] = await response.json();

      this.categories = data;
    } catch (e) {
      this.state = states.FAILED;
      this.msg = e.statusText;
      this.categories = null;
    }
  }
}

decorate(CategoriesStore, {
  categories: observable
});

export const categoriesStore = createContext(new CategoriesStore());
