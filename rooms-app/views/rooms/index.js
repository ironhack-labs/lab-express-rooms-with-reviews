<h2>Rooms</h2>
{{#each rooms}}
    <div>
        <h5>{{this.name}}</h5>
        <img src="{{this.imageUrl}}">
        <a href="/rooms/details/{{id}}">See details</a>
        <br>
    </div>
{{/each}} 