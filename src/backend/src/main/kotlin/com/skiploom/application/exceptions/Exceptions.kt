package com.skiploom.application.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

class InvalidRecipeIdException(id: String) :
    ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid recipe id: $id")

class RecipeIdNotAllowedException :
    ResponseStatusException(HttpStatus.BAD_REQUEST, "Recipe id must not be provided when creating a recipe")

class RecipeNotFoundException(id: UUID) :
    ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found: $id")
