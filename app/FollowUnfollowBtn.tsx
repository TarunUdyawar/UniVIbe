import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/data/Colors'
import { auth, firestore } from '@/Config/FirebaseConfig'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'

export default function FollowUnfollowBtn({clubId}) {

    const userId = auth.currentUser?.uid

    const [isFollowing,setIsFollowing] = useState(false)

    useEffect(()=>{
        const checkFollowStatus = async()=>{
            const userRef = doc(firestore,'users',userId);
            const userSnap = await getDoc(userRef)
            const followedClubs = userSnap.data()?.FollowedClubs || []
           setIsFollowing(followedClubs.includes(clubId))
        }
        checkFollowStatus()
    },[clubId])

    const handleToggleFollow = async()=>{
        const userRef = doc(firestore,'users',userId)
        if(isFollowing){
            await updateDoc(userRef,{
                FollowedClubs : arrayRemove(clubId)
            })
            setIsFollowing(false)

        }
        else{
            await updateDoc(userRef,{
                FollowedClubs : arrayUnion(clubId)
            })
            setIsFollowing(true)
        }
    }
  return (
     <TouchableOpacity
      onPress={handleToggleFollow}
      style={{
        backgroundColor: isFollowing ? Colors.ERROR : Colors.PRIMARY,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 15,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})