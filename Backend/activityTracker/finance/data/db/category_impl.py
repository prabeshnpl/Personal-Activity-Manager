from typing import List
from rest_framework.response import Response
from finance.domain.entity.category_entity import CategoryEntity
from finance.domain.repository.category_repo import CategoryRepository
from finance.models import Category

class CategoryRepositoryImpl(CategoryRepository):
    def list_categories(self, search_params: dict, organization:int, role:str) -> List[CategoryEntity] | Response:
        try:
            categories = Category.objects.filter(organization=organization)

            return [self.to_entity(category) for category in categories]
        except Exception as e:
            print(f"Error occured in fetching categories:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_category(self, data: dict, organization:int, role:str) -> CategoryEntity | Response:
        try:
            category = Category.objects.create(**data, organization=organization)
            return self.to_entity(category)
        except Exception as e:
            print(f"Error occured while creating category:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_category(self, id: int, data: dict, organization:int, role:str) -> CategoryEntity | Response:
        try:
            category = Category.objects.filter(organization=organization, id=id).first()

            for key, value in data:
                if key in ['id', 'organization', 'created_at']:
                    pass
                setattr(category, key, value)
                
            return self.to_entity(category) # type: ignore
        except Exception as e:
            print(f"Error occured while updating category:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_category_by_id(self, id: int, organization:int, role:str) -> CategoryEntity | Response:
        try:
            category = Category.objects.filter(organization=organization, id=id).first()
            return self.to_entity(category) # type: ignore
        except Exception as e:
            print(f"Error occured while getting category:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_category(self, id: int, organization:int, role:str) -> Response:
        category = Category.objects.filter(organization=organization, id=id).first()
        if category:
            category.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
    def to_entity(self, obj:Category):
        return CategoryEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            name=obj.name,
            category_type=obj.category_type,    
            created_at=obj.created_at,
        )