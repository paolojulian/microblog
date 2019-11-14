import React from 'react';
import PropTypes from 'prop-types';

import PCard from '../widgets/p-card/p-card';
import UserItem from '../widgets/user';
import LoadMore from '../widgets/load-more';

const User = ({ user }) => (
    <UserItem
        user={user}
        showFollow={false}
    />
)

const SearchUsers = ({
    onRequestLoad,
    totalLeft,
    users,
    ...props
}) => {

    return (
        <div {...props}>
            <PCard
                size="fit"
                style={{marginBottom: '0.5rem'}}
            >
                Users
            </PCard>
            
            {users.length > 0 && <PCard size="fit">
                {users.map((user, i) => 
                    <User
                        key={user.User.id + i}
                        user={user.User}/>)}
            </PCard>}
            {users.length === 0 && <div className="disabled">No user/s found</div>}
            <LoadMore
                totalLeft={totalLeft}
                onRequestLoad={onRequestLoad}
                />
        </div>
    )
}

SearchUsers.propTypes = {
    onRequestLoad: PropTypes.func.isRequired,
    totalLeft: PropTypes.number.isRequired,
    users: PropTypes.array.isRequired
}

export default SearchUsers
