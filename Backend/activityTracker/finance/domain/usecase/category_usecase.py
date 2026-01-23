from finance.domain.entity.category_entity import CategoryEntity
from finance.domain.repository.category_repo import CategoryRepository


class CreateCategoryUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, data: dict) -> CategoryEntity:
        return self.repo.create_category(data=data)


class GetCategoryByIdUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, id: int) -> CategoryEntity:
        return self.repo.get_category_by_id(id=id)


class UpdateCategoryUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> CategoryEntity:
        return self.repo.update_category(id=id, data=data)


class DeleteCategoryUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, id: int) -> CategoryEntity:
        return self.repo.delete_category(id=id)


class ListCategoriesUseCase:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def execute(self, search_params: dict):
        return self.repo.list_categories(search_params=search_params)