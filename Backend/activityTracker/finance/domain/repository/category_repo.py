from abc import ABC, abstractmethod
from typing import List
from finance.domain.entity.category_entity import CategoryEntity

class CategoryRepository(ABC):

    @abstractmethod
    def create_category(self, data: dict) -> CategoryEntity:
        pass

    @abstractmethod
    def get_category_by_id(self, id: int) -> CategoryEntity:
        pass

    @abstractmethod
    def update_category(self, id: int, data: dict) -> CategoryEntity:
        pass

    @abstractmethod
    def delete_category(self, id: int) -> CategoryEntity:
        pass

    @abstractmethod
    def list_categories(self, search_params: dict) -> List[CategoryEntity]:
        pass

