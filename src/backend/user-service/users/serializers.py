from django.contrib.auth.models import User
from users.models import Profile
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    id = serializers.CharField(required=False)

    def to_representation(self, instance):
        """Convert `username` to lowercase."""
        ret = {}
        ret['email'] = instance.email
        ret['first_name'] = instance.first_name
        ret['last_name'] = instance.last_name
        ret['username'] = instance.username
        ret['id'] = str(instance.id)
        return ret


class RegisterSerializer(UserSerializer):
    password = serializers.CharField(required=True, min_length=8)

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'],
                                   password=make_password(validated_data['password']),
                                   first_name=validated_data['first_name'],
                                   last_name=validated_data['last_name'],
                                   email=validated_data['email'])
        Profile.objects.create(user=user)

        return user
