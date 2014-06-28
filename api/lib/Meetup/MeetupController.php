<?php
namespace Meetup;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class MeetupController {
    
    // Get All Meetups
    public function getAllAction(Application $app){
        return new JsonResponse($app['db']->fetchAll("SELECT * FROM meetups"));
    }

    // Get Meetup By Name
    public function getOneSearchAction($name, Application $app){
        return new JsonResponse($app['db']->fetchAll("SELECT * FROM meetups WHERE UPPER(name) LIKE :NAME ORDER BY name", ['NAME' => $name.'%']));
    }
    
    // Get Meetup By Id
    public function getOneAction($id, Application $app){
        return new JsonResponse($app['db']->fetchAssoc("SELECT * FROM meetups WHERE id=:ID", ['ID' => $id]));
    }

    // Delete Meetup
    public function deleteOneAction($id, Application $app){
        return $app['db']->delete('meetups', ['ID' => $id]);
    }

    // Add Meetup
    public function addOneAction(Application $app, Request $request){
        $meetup = json_decode($request->getContent());;

        $newMeetup = [
            'id'      => (integer)$app['db']->fetchColumn("SELECT max(id) FROM meetups") + 1,
            'name'      => $meetup->name,
            'place'     => $meetup->place,
            'date'      => $meetup->date,
            'speaker'   => $meetup->speaker,
            'description' => $meetup->description
        ];
        
        $app['db']->insert('meetups', $newMeetup);
        return new JsonResponse($newMeetup);
    }

    // Edit Meetup
    public function editOneAction($id, Application $app, Request $request){
        $meetup = json_decode($request->getContent());;
        
        $newMeetup = [
            'name'      => $meetup->name,
            'place'     => $meetup->place,
            'date'      => $meetup->date,
            'speaker'   => $meetup->speaker,
            'description' => $meetup->description
        ];
        
        $app['db']->update('meetups', $newMeetup, ['id' => $id]);
        return new JsonResponse($resource);
    }
}
