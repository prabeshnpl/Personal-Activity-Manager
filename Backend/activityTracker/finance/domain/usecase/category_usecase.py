from typing import List
from finance.domain.entity.category_entity import CategoryEntity
from finance.domain.repository.category_repo import CategoryRepository
from rest_framework.response import Response

class CreateCategoryUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> CategoryEntity | Response:
        return self.repo.create_category(data=data, organization=organization, role=role)


class GetCategoryByIdUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> CategoryEntity | Response:
        return self.repo.get_category_by_id(id=id, organization=organization, role=role)


class UpdateCategoryUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> CategoryEntity | Response:
        return self.repo.update_category(id=id, data=data, organization=organization, role=role)


class DeleteCategoryUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> Response:
        return self.repo.delete_category(id=id, organization=organization, role=role)


class ListCategoriesUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[CategoryEntity] | Response:
        return self.repo.list_categories(search_params=search_params, organization=organization, role=role)

class BreakdownCategoriesUsecase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[CategoryEntity] | Response:
        return self.repo.breakdown_categories(search_params=search_params, organization=organization, role=role)

