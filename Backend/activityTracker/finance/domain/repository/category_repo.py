from abc import ABC, abstractmethod
from typing import List
from finance.domain.entity.category_entity import CategoryEntity
from rest_framework.response import Response

class CategoryRepository(ABC):

    @abstractmethod
    def create_category(self, data: dict, organization:int, role:str) -> CategoryEntity | Response:
        pass

    @abstractmethod
    def get_category_by_id(self, id: int, organization:int, role:str) -> CategoryEntity | Response:
        pass

    @abstractmethod
    def update_category(self, id: int, data: dict, organization:int, role:str) -> CategoryEntity | Response:
        pass

    @abstractmethod
    def delete_category(self, id: int, organization:int, role:str) ->  Response:
        pass

    @abstractmethod
    def list_categories(self, search_params: dict, organization:int, role:str) -> List[CategoryEntity] | Response:
        pass

