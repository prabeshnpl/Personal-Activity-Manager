from rest_framework import serializers

class LoginTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        request = self.context.get('request')
        return {
            'id':obj.user.id,
            'username':obj.user.username,
            'email':obj.user.email,
            'first_name':obj.user.first_name,
            'last_name':obj.user.last_name,
            'profile_picture':request.build_absolute_uri(obj.user.profile_picture.url), # type: ignore
            'created_at':obj.user.created_at
        }
    