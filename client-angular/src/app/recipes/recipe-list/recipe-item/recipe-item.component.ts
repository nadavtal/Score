import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe: Recipe;  
  @Input() index: number;
  // constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    // console.log(this.recipe)
  }

  // onSelected(){
  //   this.recipeService.recipeSelected.emit(this.recipe)
  // }

}
