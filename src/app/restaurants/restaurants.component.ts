import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService, Restaurant } from '../API.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit, OnDestroy{
    public createForm: FormGroup;
    public restaurants: Array<Restaurant> = [];
    private subscription: Subscription | null  = null;
    constructor (
      private api: APIService,
      private fb: FormBuilder
    ) {
      this.createForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        city: ['', Validators.required]
      });
    }

    async ngOnInit(){
      this.api.ListRestaurants().then((event) => {
          this.restaurants = event.items as Restaurant[]
      });
      this.api.OnCreateRestaurantListener().subscribe(
        (event: any) => {
          const newRestaurant = event.value.data.onCreateRestaurant;
          this.restaurants = [newRestaurant, ...this.restaurants];
        }
      );
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.subscription = null;
    }
    public onCreate(restaurant: Restaurant) {
      this.api
      .CreateRestaurant(restaurant)
      .then(() => {
        console.log('item created');
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('error creating restaurant', e)
      });
    }
}
