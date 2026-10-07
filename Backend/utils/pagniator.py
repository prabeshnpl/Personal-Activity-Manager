from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from urllib.parse import urlparse, urlunparse

class CustomPageNumberPagination(PageNumberPagination): 
    page_size = 16
    page_size_query_param = 'page_size'
    max_page_size = 100
    def _force_https(self, url):
        if not url:
            return None
        parsed = urlparse(url)
        # Replace the scheme with https
        new_url = urlunparse(('https',) + parsed[1:])
        return new_url
    
    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self._force_https(self.get_next_link()),
                'previous': self._force_https(self.get_previous_link())
            },
            'count': len(data), 
            'page_size': self.get_page_size(self.request), 
            'total_pages': self.page.paginator.num_pages,  
            'current_page': self.page.number,  
            'results': data  
        })