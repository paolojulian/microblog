import React from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import PCard from '../widgets/p-card/p-card';
import ProfileImage from '../widgets/profile-image/profile-image';

const Header = () => (
    <div style={{
        fontSize: '1rem',
        fontStyle: 'italic',
        fontWeight: '400'
    }}>
        People you may know
    </div>
)

const MutualUser = ({
    mutual,
    user
}) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0.5rem 0'
    }}>
        <div style={{ margin: '0 1rem'}}>
            <ProfileImage
                src={user.avatar_url}
                size={32}
            />
        </div>
        <div style={{
            textAlign: 'left',
            flex: '1'
        }}>
            <Link to={`/profiles/${user.username}`}>
                <div style={{
                    textTransform: 'capitalize'
                }}>
                    {`${user.first_name} ${user.last_name}`}
                </div>
                <span className="username">@{user.username}</span>
            </Link>
            <div className="disabled"
                style={{ fontStyle: 'italic' }}
            >
                {mutual > 0 ? mutual: 'No '} mutual friends
            </div>
        </div>
    </div>
)

const PeopleYouMayKnow = () => {
    const { notFollowed } = useSelector(state => state.profile);

    return (
        <PCard size="fit"
            header={<Header/>}
        >
            {notFollowed.map(data => {
                let mutual = data[0] && data[0].hasOwnProperty('mutual')
                    ? data[0].mutual
                    : 0
                return (
                    <MutualUser
                        mutual={mutual}
                        user={data.User}
                    />
                )
            })}
        </PCard>
    )
}

export default PeopleYouMayKnow
