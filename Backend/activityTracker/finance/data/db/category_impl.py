from typing import List
from rest_framework.response import Response
from finance.domain.entity.category_entity import CategoryBreakdownEntity, CategoryEntity
from finance.domain.repository.category_repo import CategoryRepository
from finance.models import Category
from django.db.models import Sum

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
            if data.get('category_type') not in ['income', 'expense']:
                return Response({'detail':"Invalid category_type"}, status=400)
            
            category = Category.objects.create(**data)
            return self.to_entity(category)
        except Exception as e:
            print(f"Error occured while creating category:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_category(self, id: int, data: dict, organization:int, role:str) -> CategoryEntity | Response:
        try:
            category = Category.objects.filter(organization=organization, id=id).first()
            if not category:
                return Response({'detail':'Invalid category'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at']:
                    continue
                elif key=='category_type':
                    if value not in ['income', 'expense']:
                        return Response({'detail':"Invalid category_type"}, status=400)
                setattr(category, key, value)
            category.save()
                
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

    def breakdown_categories(self, search_params: dict, organization:int, role:str) -> List[CategoryEntity] | Response:
        try:
            categories = Category.objects.filter(organization=organization)
            categories = categories.annotate(
                total=Sum('transactions__amount')
            )
            return [self.to_breakdown_entity(category) for category in categories]
        except Exception as e:
            print(f"Error occured in fetching categories:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
    
    
    def to_entity(self, obj:Category):
        return CategoryEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            name=obj.name,
            category_type=obj.category_type,    
            color=obj.color,
            created_at=obj.created_at,
        )

    def to_breakdown_entity(self, obj:Category):
        return CategoryBreakdownEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            name=obj.name,
            category_type=obj.category_type,    
            color=obj.color,
            created_at=obj.created_at,
            total=obj.total # type: ignore
        )