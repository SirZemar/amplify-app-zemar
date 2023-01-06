import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService, Restaurant } from '../API.service';
import { Subscription } from 'rxjs';
import { Analytics, Auth } from 'aws-amplify';


@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit, OnDestroy{
    public createForm: FormGroup;
    public restaurants: Array<Restaurant> = [];
    private subscription: Subscription | null  = null;
  private user: any

    constructor (
      private api: APIService,
      private fb: FormBuilder,
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
      this.user = await Auth.currentAuthenticatedUser({ bypassCache: false })
      console.log('User: ', this.user)
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.subscription = null;
    }

  public async onCreate(restaurant: Restaurant) {
      this.api
      .CreateRestaurant(restaurant)
      .then(() => {
        console.log('item created');
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('error creating restaurant', e)
      });

    console.log(restaurant)

    /*  await Analytics.updateEndpoint({
       address: this.user.attributes.email,
       channelType: 'EMAIL',
       optOut: 'NONE',
       attributes: {
         restaurantName: [restaurant.name],
         restaurantCity: [restaurant.city],
         restaurantDescription: [restaurant.description]
       },
       userAttributes: {
         username: [this.user.username]
       }
     });
     await Analytics.record({ name: 'RestaurantCreated' }); */

    //Create a new Pinpoint object.
    }

}
