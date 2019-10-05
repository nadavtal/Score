import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { shoppingListService } from '../shopping-list/shopping-list.service';


@Injectable()
export class RecipeService {
    

    private recipes: Recipe[] = [
        new Recipe
        ('A Test Recipe',
         'This is simply a test',
          'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
           [
               new Ingredient('meat', 5),
               new Ingredient('fries', 3),
              
            ]),
        new Recipe(
         'A Test Recipe 2',
         'This is another simply a test',
         'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
          [
              new Ingredient('Buns', 2),
              new Ingredient('meat', 4),
            ])
      ];

      constructor(private slService: shoppingListService) {
          
      }
    
    getRecipes(){
        return this.recipes.slice();
    }
    getRecipe(index:number){
        
        return this.recipes[index];
    }

    addIngredientToShoppingList(ingredients: Ingredient[]){
       this.slService.addIngredients(ingredients); 
    }
}